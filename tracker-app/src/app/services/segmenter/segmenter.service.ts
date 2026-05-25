import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SegmenterService {
  private segmenter = new Intl.Segmenter('en', {
    granularity: 'sentence',
  });

  split(text: string) {
    return this.segmenter.segment(text);
  }

  changeLanguage(lang: string = 'en') {
    this.segmenter = new Intl.Segmenter(lang, {
      granularity: 'sentence',
    });
  }
}
