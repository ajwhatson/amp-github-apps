/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Release} from './models/view-models';
import {Release as ReleaseEntity} from '../types';
import fetch from 'node-fetch';
const SERVER_URL = `http://localhost:3000`;

export class ApiService implements ApiService {
  private getRequestMany(url: string): Promise<ReleaseEntity[]> {
    return fetch(url).then((result) => result.json());
  }
  private getRequestSingle(url: string): Promise<ReleaseEntity> {
    return fetch(url).then((result) => result.json());
  }

  async getReleases(): Promise<Release[]> {
    const releases = await this.getRequestMany(SERVER_URL);
    return releases.map((release: ReleaseEntity) => {
      return new Release(release);
    });
  }

  async getRelease(releaseName: string): Promise<Release[]> {
    const release = await this.getRequestSingle(SERVER_URL + '/release/' + releaseName);
    const history: Release[] = [];
    for (let i = 0; i < release.promotions.length; i++) {
      history.push(new Release(release, i));
    }
    return history;
  }

  async getReleaseHistory(release: string): Promise<Release[]> {
    const releases = await this.getRequestMany(SERVER_URL);
    const releaseEntity: ReleaseEntity = releases.find(search => (search.name === release));
    const history: Release[] = [];
    for (let i = 0; i < releaseEntity.promotions.length; i++) {
      history.push(new Release(releaseEntity, i));
    }
    return history;
  }
}
