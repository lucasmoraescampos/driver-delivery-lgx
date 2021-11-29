import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private customClass = {
    container: 'alert-custom-container',
    popup: 'alert-custom-popup',
    header: 'alert-custom-header',
    title: 'alert-custom-title',
    closeButton: 'alert-custom-close-button',
    icon: 'alert-custom-icon',
    image: 'alert-custom-image',
    content: 'alert-custom-content',
    input: 'alert-custom-input',
    actions: 'alert-custom-actions',
    confirmButton: 'alert-custom-confirm-button',
    cancelButton: 'alert-custom-cancel-button',
    footer: 'alert-custom-footer'
  }

  constructor() { }

  public show(options: AlertOptions) {
    Swal.fire({
      icon: options.icon,
      title: options.message,
      showCancelButton: options.showCancelButton !== undefined ? options.showCancelButton : true,
      confirmButtonText: options.confirmButtonText ? options.confirmButtonText : 'Confirmar',
      cancelButtonText: options.cancelButtonText ? options.cancelButtonText : 'Cancel',
      heightAuto: false,
      allowOutsideClick: false,
      customClass: this.customClass
    }).then(result => {
      if (result.value) {
        if (options.onConfirm) {
          options.onConfirm();
        }
      }
      else {
        if (options.onCancel) {
          options.onCancel();
        }
      }
    });
  }

  public toast(options: AlertOptions) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: options.duration ? options.duration : 4500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: options.icon,
      title: options.message
    });
  }

  public chooseImage(options: AlertOptions) {

    let html = document.createElement('div');

    const el = document.createElement('ion-button');

    el.style.marginTop = '10px';
    
    el.setAttribute('mode', 'ios');

    el.setAttribute('expand', 'block');

    el.setAttribute('color', 'primary');

    el.innerHTML = 'Choose Image';

    el.onclick = () => {
      Swal.close();
      if (options.onConfirm) {
        options.onConfirm();
      }
    }
    
    html.appendChild(el);

    Swal.fire({
      icon: options.icon,
      imageWidth: 60,
      title: options.title,
      html: html,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      heightAuto: false,
      allowOutsideClick: false,
      customClass: this.customClass
    }).then(result => {
      if (options.onCancel) {
        options.onCancel();
      }
    });
    
  }

  public sms(options: AlertOptions) {

    let html = document.createElement('div');

    if (options.message) {

      const p = document.createElement('p');

      p.style.marginTop = '0';

      p.innerText = options.message;

      html.appendChild(p);

    }

    const el = document.createElement('ion-button');

    el.style.marginTop = '10px';
    
    el.setAttribute('mode', 'ios');

    el.setAttribute('href', `sms:${options.phone};?&body=${options.body}`);

    el.setAttribute('expand', 'block');

    el.setAttribute('color', 'success');

    el.innerHTML = '<ion-icon slot="start" name="mail-outline"></ion-icon> Send SMS';

    el.onclick = () => {
      Swal.close();
      if (options.onConfirm) {
        options.onConfirm();
      }
    }
    
    html.appendChild(el);

    Swal.fire({
      icon: options.icon,
      imageWidth: 60,
      title: options.title,
      html: html,
      showConfirmButton: false,
      showCancelButton: false,
      cancelButtonText: 'Do not send',
      heightAuto: false,
      allowOutsideClick: false,
      customClass: this.customClass
    }).then(result => {
      if (options.onCancel) {
        options.onCancel();
      }
    });
    
  }

}

interface AlertOptions {
  title?: string;
  imageUrl?: string;
  message?: string;
  body?: string;
  phone?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  onConfirm?: Function;
  onCancel?: Function;
  duration?: number;
  icon?: SweetAlertIcon;
  buttons?: Array<{
    icon?: string;
    color?: string;
    fill?: string; 
    text: string;
    callback: Function
  }>
}