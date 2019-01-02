/**
 * Simple component to abstract the editing of a person
 * object.
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'person-edit',
  template: `
    <form [formGroup]="personForm" (ngSubmit)="onPersonFormSubmit()">
      <input type="hidden" formControlName="id">
      <div class="form-group">
        <label for="firstname">Firstname</label>
        <input type="text" (keydown.tab)="enterEvent($event, $event.target.value)" class="form-control" id="firstname" placeholder="Firstname" formControlName="firstname">
      </div>
      <div class="form-group">
        <label for="surname">Surname</label>
        <input type="text" class="form-control" id="surname" placeholder="Surname" formControlName="surname">
      </div>
      <div class="form-group">
        <label for="twitter">Twitter</label>
        <div class="input-group">
          <div class="input-group-addon">@</div>
          <input type="text" class="form-control" id="twitter" placeholder="Surname" formControlName="twitter">
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Save</button>
    </form>
  `
})
export class PersonEditComponent implements OnInit {
  @Input() personForm: FormGroup;

  @Input() person;
  @Output() savePerson = new EventEmitter<any>();
  @Output() changeValue = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
    if (!this.personForm)
      this.personForm = this.fb.group({
        id: '',
        firstname: '',
        surname: '',
        twitter: ''
      });
  }

  ngOnInit() {
    if (!this.person)
      this.personForm.setValue({
        id: this.person.id || -1,
        firstname: this.person.name || '',
        surname: this.person.surname || '',
        twitter: this.person.twitter || ''
      });
/** 
    this.personForm.get('name').valueChanges.subscribe(value => {
        this.changeValue.emit({name:value});
    });
    */
  }

  enterEvent(event: KeyboardEvent, value:string){
      var id = event.srcElement.id;
      console.log(event);
    this.changeValue.emit(
      {
        [id]: value
      }
    );
    
  }

  onPersonFormSubmit() {
    let dataModel = this.personForm.value;
    this.savePerson.emit(dataModel);
  }
}
