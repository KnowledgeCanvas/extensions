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
import {Injectable} from '@angular/core';
import {KnowledgeSource} from "../models/knowledge.source.model";

@Injectable({
  providedIn: 'root'
})
export class IpcService {

  constructor() {
  }

  async send(ks: Partial<KnowledgeSource>) {
    let str = JSON.stringify(ks);
    console.log(`Sending packet: ${str} -- `, ks);
    let url = `http://localhost:9000/external`;
    await fetch(url, {
      method: 'POST',
      body: str
    })
  }
}
