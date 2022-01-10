const fs = require("fs/promises");
const path = require("path");
const contacts = require("./contacts.json");
const { v4: uuidv4 } = require("uuid");
const { brotliDecompress } = require("zlib");
const e = require("express");

const contactsPath = path.join(__dirname, "./contacts.json");

const getContactsList = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const result = JSON.parse(data);
  return result;
};

const listContacts = async () => {
  try {
    const list = await getContactsList();
    return list;
  } catch (error) {
    console.error("error", error);
  }
};

const getContactById = async (contactId) => {
  try {
    const list = await getContactsList();
    const contact = list.filter((item) => item.id === contactId);
    return contact;
  } catch (error) {
    console.error("error", error);
  }
};

const removeContact = async (contactId) => {
  try {
    const list = await getContactsList();
    const contact = list.filter((item) => item.id !== contactId);
    if (list.length === contact.length) return false;
    await fs.writeFile(contactsPath, JSON.stringify(contact));
    return contact;
  } catch (error) {
    console.error("error", error);
  }
};

const addContact = async (body) => {
  const newContact = {
    id: uuidv4(),
    name: body.name,
    email: body.email,
    phone: body.phone,
  };

  try {
    const list = await getContactsList();
    list.push(newContact);
    fs.writeFile(contactsPath, JSON.stringify(list));
    return newContact;
  } catch (error) {
    console.error("error", error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const list = await getContactsList();

    const contact = list.filter((item) => {
      if (item.id === contactId) {
        item.name = body.name;
        item.email = body.email;
        item.phone = body.phone;
      }
      return item;
    });

    fs.writeFile(contactsPath, JSON.stringify(contact));

    const result = contact.find((item) => item.id === contactId);

    return result;
  } catch (error) {
    console.error("error", error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
