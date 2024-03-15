import {Component, OnInit} from '@angular/core';
import * as asn1js from "asn1js";
import {Certificate} from "pkijs";
import {CertInfo} from "./cert-info";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  certificateInfo: any = null;
  isInputFieldsOpen: boolean = false;
  buttonText: string = 'Додати'
  certList: CertInfo[] = []
  selectedCert?: CertInfo;

  constructor() {}

  ngOnInit() {
    if (this.certList.length === 0 && localStorage.getItem('certList')) {
      const storedJsonString = localStorage.getItem('certList');
      this.certList = JSON.parse(storedJsonString!);
      this.selectedCert = this.certList[0];
    }
  }

  prepareFile(file: any) {
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const arrayBuffer = e.target.result;
      this.certificateInfo = await this.parseCertificate(arrayBuffer);
    };
    reader.readAsArrayBuffer(file);
  }

  async parseCertificate(buffer: ArrayBuffer): Promise<any> {
    const asn1 = asn1js.fromBER(buffer);
    const certificate = new Certificate({ schema: asn1.result });

    this.certList.push({
      commonName: certificate.subject.typesAndValues.find(t => t.type === "2.5.4.3")!.value.valueBlock.value,
      issuerCN: certificate.issuer.typesAndValues.find(t => t.type === "2.5.4.3")!.value.valueBlock.value,
      validFrom: certificate.notBefore.value.toISOString(),
      validTo: certificate.notAfter.value.toISOString(),
    })
    const jsonString = JSON.stringify(this.certList);
    localStorage.setItem('certList', jsonString);
    this.showInputFields();
    this.showInfo(this.certList[this.certList.length - 1]);
  }

  showInputFields() {
    this.buttonText = this.buttonText === 'Додати' ? 'Назад' : 'Додати';
    this.isInputFieldsOpen = !this.isInputFieldsOpen;
  }

  showInfo(cert: CertInfo) {
    this.selectedCert = cert;
  }

  fileFromDragAndDrop(event: Event) {
    this.prepareFile(event)
  }
  fileFromInput(event: any) {
    this.prepareFile(event.target!.files[0])
  }
}
