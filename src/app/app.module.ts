/**
 Copyright 2022 Rob Royce

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PopupComponent } from './popup/popup.component';
import {ImageModule} from "primeng/image";
import {ButtonModule} from "primeng/button";
import {DividerModule} from "primeng/divider";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {FormsModule} from "@angular/forms";
import {ChromeTab} from "./models/tab.model";
import {CheckboxModule} from "primeng/checkbox";

@NgModule({
  declarations: [
    AppComponent,
    PopupComponent
  ],
  imports: [
    BrowserModule,
    ImageModule,
    ButtonModule,
    DividerModule,
    ProgressSpinnerModule,
    FormsModule,
    CheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

declare global {
  class chrome {
    static action: {
      disable: any;
      enable: any;
      getBadgeBackgroundColor: any;
      getBadgeText: any;
      getPopup: any;
      getTitle: any;
      getUserSettings: any;
      setBadgeBackgroundColor: any;
      setBadgeText: any;
      setIcon: any;
      setPopup: any;
      setTitle: any;
    };
    static csi: any;
    static dom: any;
    static extension: any;
    static loadTimes: any;
    static management: any;
    static permissions: any;
    static runtime: any;
    static scripting: any;
    static tabs: ChromeTab;
    static windows: any;
  }
}
