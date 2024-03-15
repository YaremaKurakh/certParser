import { Injectable } from '@angular/core';
import * as asn1js from 'asn1js';
import { Certificate } from 'pkijs';

@Injectable({
  providedIn: 'root'
})
export class CertificateParserService {

  constructor() { }

  async parseCertificate(buffer: ArrayBuffer): Promise<any> {
    const asn1 = asn1js.fromBER(buffer);
    const certificate = new Certificate({ schema: asn1.result });

    return {
      commonName: certificate.subject.typesAndValues.find(t => t.type === "2.5.4.3")?.value.valueBlock.value,
      issuerCN: certificate.issuer.typesAndValues.find(t => t.type === "2.5.4.3")?.value.valueBlock.value,
      validFrom: certificate.notBefore.value.toISOString(),
      validTo: certificate.notAfter.value.toISOString()
    };
  }
}
