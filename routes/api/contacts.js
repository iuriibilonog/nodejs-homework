const express = require("express");
const router = express.Router();

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../../model/index");
const {
  addPostValidation,
} = require("../../middlewares/validationMiddlewares");
const { authMiddelware } = require("../../middlewares/authMiddleware");

router.get("/", authMiddelware, async (req, res, next) => {
  const { _id: owner } = req.user;
  const contacts = await listContacts(owner);
  res.json({ contacts });
});

router.get("/:contactId", authMiddelware, async (req, res, next) => {
  const { _id: owner } = req.user;
  const id = req.params.contactId;
  const contact = await getContactById(id, owner);

  !contact
    ? res.status(404).json({ message: "Not found" })
    : res.json({ contact });
});

router.post(
  "/",
  [authMiddelware, addPostValidation],
  async (req, res, next) => {
    const { _id: owner } = req.user;
    const body = req.body;
    const contact = await addContact(body, owner);

    res.status(201).json({ contact });
  }
);

router.delete("/:contactId", authMiddelware, async (req, res, next) => {
  const { _id: owner } = req.user;
  const id = req.params.contactId;
  const contact = await removeContact(id, owner);

  !contact
    ? res.status(404).json({ message: "Not found" })
    : res.json({ message: "contact deleted" });
});

router.put(
  "/:contactId",
  [authMiddelware, addPostValidation],
  async (req, res, next) => {
    const { _id: owner } = req.user;
    const contact = await updateContact(req.params.contactId, req.body, owner);
    console.log("contact", contact);
    !contact
      ? res.status(404).json({ message: "Not found" })
      : res.json({ contact });
  }
);

router.patch("/:contactId/favorite", authMiddelware, async (req, res, next) => {
  const { _id: owner } = req.user;
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ message: "missing field favorite" });
  const contact = await updateStatusContact(
    req.params.contactId,
    req.body,
    owner
  );
  console.log("contact", contact);

  !contact
    ? res.status(404).json({ message: "Not found" })
    : res.json({ contact });
});

module.exports = router;
