import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { Contact } from './contact.model';

@Injectable({providedIn: 'root'})
export class ContactService implements OnInit{

  constructor() { }
  contactModified = new Subject<Contact[]>();
  selectedContact= new Subject<Contact>();
  mode = new Subject<boolean>();
  index: number;

  private contactsData: Contact[] = this.getContacts();

  ngOnInit(): void {}

  sortContacts (ArrayInput:Contact[]) {
    ArrayInput.sort(function(a,b) {
      if (a.firstname < b.firstname) {
        return -1
      } else if (a.firstname > b.firstname) {
        return 1
      } else {
        return 0
      }
    });

    return ArrayInput
  }

  getContacts() {
    // Receives contact array from local storage and converts it to a javascript value
    const contactsFrmLS = JSON.parse(localStorage.getItem("contactData"));

    // This sorts the data received before it gets returned
    const contactsDataSrc = this.sortContacts(contactsFrmLS).slice() 
    return contactsDataSrc;
  }

  addContact (contactDt: Contact) {
    this.contactsData.push(contactDt);

    // The use of this line of code to ensure the main array list doesn't get changed somewhere else 
    // on the code due to the fact that it holds reference values
    this.contactModified.next(this.sortContacts(this.contactsData).slice())
  }

  // This returns a contact using the passed index value when called
  getContact(index: number) {
    this.index = index;
    return this.contactsData[index];
  }

  updateContact (contactData:Contact ) {
    this.contactsData[this.index] = contactData;
    this.contactModified.next(this.contactsData.slice())
  }

  deleteContact (index: number) {
    // The splice function removes the value having the passed index from the array.
    this.contactsData.splice(index, 1);

    this.contactModified.next(this.contactsData.slice())
  }

  loacalStorageSave() {
    // Saves the values in the array to local storage. Stringify is used as local
    // storage doesn't take javascript values
    localStorage.setItem("contactData", JSON.stringify(this.contactsData))
  }

}
