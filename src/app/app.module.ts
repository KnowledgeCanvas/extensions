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
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {ImageModule} from "primeng/image";
import {ButtonModule} from "primeng/button";
import {DividerModule} from "primeng/divider";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {FormsModule} from "@angular/forms";
import {ChromeTab, FirefoxTab} from "./models/tab.model";
import {CheckboxModule} from "primeng/checkbox";
import {ThumbnailComponent} from './knowledge-source/thumbnail.component';
import {IconComponent} from './knowledge-source/icon.component';
import {CardModule} from "primeng/card";
import {TooltipModule} from "primeng/tooltip";
import {ChipsModule} from "primeng/chips";
import { CardComponent } from './knowledge-source/card.component';
import {ToggleButtonModule} from "primeng/togglebutton";
import {TabViewModule} from "primeng/tabview";
import {InputTextareaModule} from "primeng/inputtextarea";

@NgModule({
  declarations: [
    AppComponent,
    ThumbnailComponent,
    IconComponent,
    CardComponent
  ],
    imports: [
        BrowserModule,
        ImageModule,
        ButtonModule,
        DividerModule,
        ProgressSpinnerModule,
        FormsModule,
        CheckboxModule,
        CardModule,
        TooltipModule,
        ChipsModule,
        ToggleButtonModule,
        TabViewModule,
        InputTextareaModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

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

  class browser {
    static tabs: FirefoxTab;
  }
}
