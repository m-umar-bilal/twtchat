import { Injectable } from '@angular/core';
// import * as AWS from 'aws-sdk';
// const AWSService = AWS;
// AWSService.config.accessKeyId = 'AKIAJL6QB6WKT3XIXQGA';
// AWSService.config.secretAccessKey = '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';
// AWSService.config.region = 'us-west-2';

// Service to set the API headers
@Injectable()
export class AWSS3Service {

  public bucketId = '';
  public accessKeyId = '';
  public secretAccessKey = '';
  public bucket: any;
  public cache: any = {};

  constructor() {
    // this.bucket = new AWSService.S3({
    //   params: {
    //     Bucket: this.bucketId
    //   }
    // });
  }

  public getSignedFileFromS3(key) {
    const params = {
      Bucket: this.bucketId,
      Key: key
    };
    if (this.cache[`${key}`]) {
      return this.cache[`${key}`];
    } else {
      const url = this.bucket.getSignedUrl('getObject', params);
      this.cache[`${key}`] = url;
      return url;
    }
  }

}

