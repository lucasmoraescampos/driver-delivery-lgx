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
      cancelButtonText: options.cancelButtonText ? options.cancelButtonText : 'Cancelar',
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

  public options(options: AlertOptions) {

    let html = document.createElement('div');

    options.buttons.forEach(button => {
      
      const el = document.createElement('ion-button');

      el.style.marginTop = '10px';
      
      el.setAttribute('expand', 'block');

      if (button.color) {
        el.setAttribute('color', button.color);
      }

      if (button.fill) {
        el.setAttribute('fill', button.fill);
      }

      if (button.icon) {
        el.innerHTML = `<ion-icon slot="start" name="${button.icon}" src="${button.icon}"></ion-icon> ${button.text}`;
      }

      else {
        el.innerText = button.text;
      }

      el.onclick = () => {
        Swal.close();
        button.callback();
      };
      
      html.appendChild(el);

    });

    Swal.fire({
      imageUrl: options.imageUrl ?? null,
      imageWidth: 60,
      title: options.title,
      html: html,
      cancelButtonText: 'Cancelar',
      showConfirmButton: false,
      showCancelButton: true,
      heightAuto: false,
      allowOutsideClick: false,
      customClass: this.customClass
    });
  }

  public custom(options: AlertOptions) {
    Swal.fire({
      imageUrl: options.imageUrl,
      imageWidth: 60,
      title: options.title,
      text: options.message,
      showCancelButton: options.showCancelButton ?? false,
      confirmButtonText: options.confirmButtonText ?? 'Ok',
      cancelButtonText: options.cancelButtonText ?? 'Cancelar',
      heightAuto: false,
      allowOutsideClick: false,
      customClass: this.customClass,
    }).then(result => {
      if (result.value) {
        options.onConfirm();
      }
    });
  }

  public terms(options: AlertOptions) {
    Swal.fire({
      imageUrl: '../../../assets/icon/terms.svg',
      imageWidth: 60,
      title: 'Termos e condições',
      html: 'Eu concordo com os <a>termos e condições</a>',
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText ? options.confirmButtonText : 'Confirmar',
      cancelButtonText: options.cancelButtonText ? options.cancelButtonText : 'Cancelar',
      heightAuto: false,
      allowOutsideClick: false,
      customClass: this.customClass,
    }).then(result => {
      if (result.value) {
        options.onConfirm();
      }
    });
  }

}

interface AlertOptions {
  title?: string;
  imageUrl?: string;
  message?: string;
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