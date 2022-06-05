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
import { Injectable } from '@angular/core';
import {ExtensionPacket} from "../models/packet.model";

@Injectable({
  providedIn: 'root'
})
export class IpcService {

  constructor() { }

  async send(packet: ExtensionPacket | undefined) {
    if (!packet) {
      return;
    }

    let url = `http://localhost:9000/external?`
      + `link=${packet.url}`
      + `&title=${packet.title}`
      + `&favIconUrl=${packet.favIconUrl}`
      + `&selectedText=${packet.selectedText}`;
    await fetch(url)
  }
}
