import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts: MatTableDataSource<Contact>;

  // Holds names of strings of columns displayed in the contacts table
  displayedColumns: string[] = ["firstname","lastname", "email", "phone", "address", "edit"]; 

  // This property determines when the New Contact Component is displayed
  contactComponent = false;

  contactsSubscription: Subscription;
  index: number;

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    // Converts the data array received from contact service into an Angular Material table data soruce
    this.contacts = new MatTableDataSource(
      this.contactService.getContacts());
    
    // Subscribes to the contact modified observable to update the contacts displayed, and also updates
    // data saved in local storage whenever the contact array is modified
    this.contactsSubscription = this.contactService.contactModified
      .subscribe((contactsData => {
      this.contacts = new MatTableDataSource (contactsData);
      this.contactService.loacalStorageSave();
    }))

  }

  onSearch(SearchValue:string) {
    this.contacts.filter = SearchValue.trim().toLowerCase();
  }

  // The edit status is passed in the html depending on if the edit button is clicked
  // or the add contact button is clicked
  onAddContact(editMode: Boolean, index: number = null) {
    this.contactComponent = !this.contactComponent;
    if(editMode == true) {

      // Gets the contact selected from the contact service using the index passed
      const contact = this.contactService.getContact(index);

      // Passes details of the selected contact into the contact form
      this.contactService.selectedContact.next(contact);

      // Informs the new contact component of the current mode
      this.contactService.mode.next(true);

    } else {
      this.contactService.mode.next(false);
    }
  }

  onDeleteContact(index: number) {
    this.contactService.deleteContact(index)
  }


  ngOnDestroy() {
    this.contactsSubscription.unsubscribe();
  }
  

}
