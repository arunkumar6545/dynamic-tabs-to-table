//our root app component
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

import { TabsComponent } from './tabs/tabs.component';

@Component({
  selector: 'my-app',
  template: `
  {{personsForm.value | json}}
  <button class="btn btn-default" (click)="changeValue()"><i class="glyphicon glyphicon-question-sign"></i> change value this</button>
    <my-tabs>
      <my-tab [tabTitle]="'People'">
        <h3>List of People</h3>
        <people-list
          [people]="people"
          (addPerson)="onAddPerson()"
          (editPerson)="onEditPerson($event)">
        </people-list>
        <hr />
        <button class="btn btn-default" (click)="onOpenAbout()"><i class="glyphicon glyphicon-question-sign"></i> About this</button>
      </my-tab>
    </my-tabs>

    <ng-template let-person="person" #personEdit>
      <person-edit [person]="person.person" [personForm] = "person.fg" (changeValue)="onChangeValue($event)"  (savePerson)="onPersonFormSubmit($event)"></person-edit>
    </ng-template>
    <ng-template #about>
      about
    </ng-template>
  `
})
export class AppComponent {
  @ViewChild('personEdit') editPersonTemplate;
  @ViewChild('about') aboutTemplate;
  @ViewChild(TabsComponent) tabsComponent;

  personsForm: FormGroup;

  people = [
    {
      id: 1,
      firstname: 'Juri',
      surname: 'Strumpflohner',
      twitter: '@juristr'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.personsForm = this.fb.group(
      {
        persons: this.fb.array([])
      }
    );
  }

  onChangeValue(event){    
    console.log(event);
    let p = this.personsForm.get('persons') as FormArray;
    p.controls.forEach((c: FormGroup) => {
        c.patchValue(event);
    });

      
    
  }

  onEditPerson(person) {
    this.tabsComponent.openTab(
      `Editing ${person.name}`,
      this.editPersonTemplate,
      person,
      true
    );
  }

  onAddPerson() {
    let newFb = this.fb.group({
        id: '',
        firstname: 'arun',
        surname: '',
        twitter: ''
      });

      (this.personsForm.get('persons') as FormArray).push(newFb);
      let datacontext = {person: {}, fg: newFb};
      console.log((datacontext));
    this.tabsComponent.openTab('New Person', this.editPersonTemplate, datacontext, true);
  }

  onPersonFormSubmit(dataModel) {
    if (dataModel.id > 0) {
      this.people = this.people.map(person => {
        if (person.id === dataModel.id) {
          return dataModel;
        } else {
          return person;
        }
      });
    } else {
      // create a new one
      dataModel.id = Math.round(Math.random() * 100);
      this.people.push(dataModel);
    }

    // close the tab
    this.tabsComponent.closeActiveTab();
  }

  onOpenAbout() {
    this.tabsComponent.openTab('About', this.aboutTemplate, {}, true);
  }
}
