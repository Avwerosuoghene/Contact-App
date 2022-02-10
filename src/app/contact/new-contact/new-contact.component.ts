import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';


@Component({
  selector: 'app-new-contact',
  templateUrl: './new-contact.component.html',
  styleUrls: ['./new-contact.component.css']
})
export class NewContactComponent implements OnInit, OnDestroy {

  // Emits the close event to the contact list component in order to toggle off this component
  @Output() close = new EventEmitter<void>();

  contactForm: FormGroup;
  contact:Contact;
  editMode = false ;
  cntServiceSubscription: Subscription;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
   
    this.initForm();

    // Observes the status of the mode passed from the contact list component
    this.contactService.mode.subscribe(mode => {
      this.editMode = mode;
    })
    
  }

  contactFormSubmit() {

    // Passes the values in the contact form into a new Contact object
    const newContact = new Contact (
      this.contactForm.value["firstname"],
      this.contactForm.value["lastname"],
      this.contactForm.value["email"],
      this.contactForm.value["phone"],
      this.contactForm.value["address"],
    )
    if (this.editMode == false) {

      // calls the addcontact class inside contactservice and passes the new contact object in
      this.contactService.addContact(newContact);
    } else {
      this.contactService.updateContact(newContact);
      this.onClose();
    }
    this.contactForm.reset();
  }

  initForm () {
    
    // Subscribes to the selectedContact observable in the contact service and passes
    // the details of the selected contact received from the contact list into the form
    this.contactService.selectedContact.subscribe((contact) => {
     this.contactForm.setValue({
      "firstname": contact.firstname,
      "lastname": contact.lastname,
      "email": contact.email,
      "phone": contact.phone,
      "address": contact.address,
     })
    })

    // Creates a recative Angular Form
    this.contactForm = new FormGroup({
      "firstname": new FormControl(null, Validators.required),
      "lastname": new FormControl(null, Validators.required),
      "email": new FormControl(null, (Validators.required, Validators.email)),
      "phone": new FormControl(null, Validators.required),
      "address": new FormControl(null, Validators.required),
    });
  }

  onClose() {
    this.contactForm.reset();
    this.close.emit();
  }

  ngOnDestroy() {
    this.cntServiceSubscription.unsubscribe();
  }

}
