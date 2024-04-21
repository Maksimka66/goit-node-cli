import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

export async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, {
      encoding: "utf-8",
    });
    return JSON.parse(data);
  } catch (error) {
    throw error;
  }
}

function writeContacts(contacts) {
  return fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

export async function getContactById(contactId) {
  const contacts = await listContacts();
  const markedContact = contacts.find((contact) => contact.id === contactId);
  return markedContact ? markedContact : null;
}

export async function removeContact(contactId) {
  const contacts = await listContacts();
  const removedContactIndex = contacts.findIndex(
    (contact) => contact.id === contactId
  );

  if (removedContactIndex === -1) {
    return null;
  }

  const newList = contacts.filter((contact) => contact.id !== contactId);

  writeContacts(newList);

  return contacts[removedContactIndex];
}

export async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = { id: crypto.randomUUID(), name, email, phone };

  writeContacts(contacts.push(newContact));

  return newContact;
}
