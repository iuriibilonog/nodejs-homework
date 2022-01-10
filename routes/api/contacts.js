const express = require("express");
const router = express.Router();
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../model/index");
const {
  addPostValidation,
} = require("../../middlewares/validationMiddlewares");

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.json({ contacts });
});

router.get("/:contactId", async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);
  contact.length === 0
    ? res.status(404).json({ message: "Not found" })
    : res.json({ contact });
});

router.post("/", addPostValidation, async (req, res, next) => {
  // if (!req.body.name)
  //   return res.status(400).json({ message: "missing required name field" });
  // if (!req.body.email)
  //   return res.status(400).json({ message: "missing required email field" });
  // if (!req.body.phone)
  //   return res.status(400).json({ message: "missing required phone field" });
  const newContact = await addContact(req.body);
  res.status(201).json({ newContact });
});

router.delete("/:contactId", async (req, res, next) => {
  const contact = await removeContact(req.params.contactId);
  !contact
    ? res.status(404).json({ message: "Not found" })
    : res.json({ message: "contact deleted" });
});

router.put("/:contactId", addPostValidation, async (req, res, next) => {
  // if (Object.keys(req.body).length === 0)
  //   return res.status(400).json({ message: "missing fields" });
  const contact = await updateContact(req.params.contactId, req.body);
  !contact
    ? res.status(404).json({ message: "Not found" })
    : res.json({ contact });
});

module.exports = router;
