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

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.json({ contacts });
});

router.get("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  const contact = await getContactById(id);

  !contact
    ? res.status(404).json({ message: "Not found" })
    : res.json({ contact });
});

router.post("/", addPostValidation, async (req, res, next) => {
  const contact = await addContact(req.body);

  res.status(201).json({ contact });
});

router.delete("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  const contact = await removeContact(id);

  !contact
    ? res.status(404).json({ message: "Not found" })
    : res.json({ message: "contact deleted" });
});

router.put("/:contactId", addPostValidation, async (req, res, next) => {
  const contact = await updateContact(req.params.contactId, req.body);
  !contact
    ? res.status(404).json({ message: "Not found" })
    : res.json({ contact });
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ message: "missing field favorite" });
  const contact = await updateStatusContact(req.params.contactId, req.body);

  !contact
    ? res.status(404).json({ message: "Not found" })
    : res.json({ contact });
});

module.exports = router;
