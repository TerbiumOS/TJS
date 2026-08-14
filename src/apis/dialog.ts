/**
 * Dialog API
 * Provides cross-environment dialog support matching Terbium API
 */

import type { DialogAPI, DialogProps } from "../types";
import { getNativeTerbiumAPI } from "../env";

export class TerbiumDialog implements DialogAPI {
	private get native() {
		const tb = getNativeTerbiumAPI();
		return tb?.dialog;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	/**
	 * Show an alert dialog
	 * Terbium: uses tb.dialog.Alert
	 * Browser: uses window.alert
	 */
	Alert(props: DialogProps): void {
		if (this.isTerbium) {
			this.native.Alert(props);
			return;
		}
		const message = props.message || props.title;
		window.alert(message);
		if (props.onOk) {
			props.onOk();
		}
	}

	/**
	 * Show a message dialog
	 * Terbium: uses tb.dialog.Message
	 * Browser: uses window.confirm
	 */
	Message(props: DialogProps): void {
		if (this.isTerbium) {
			this.native.Message(props);
			return;
		}
		const message = props.message || props.title;
		const result = window.confirm(message);
		if (result && props.onOk) {
			props.onOk(true);
		} else if (!result && props.onCancel) {
			props.onCancel();
		}
	}

	/**
	 * Show a select dialog
	 * Terbium: uses tb.dialog.Select
	 * Browser: uses window.prompt or custom dialog
	 */
	Select(props: DialogProps): void {
		if (this.isTerbium) {
			this.native.Select(props);
			return;
		}
		if (props.options && props.options.length > 0) {
			this.createSelectDialog(props);
		} else {
			const result = window.prompt(props.message || props.title, props.defaultValue || "");
			if (result !== null && props.onOk) {
				props.onOk(result);
			} else if (result === null && props.onCancel) {
				props.onCancel();
			}
		}
	}

	/**
	 * Show an authentication dialog
	 * Terbium: uses tb.dialog.Auth
	 * Browser: uses custom dialog
	 */
	Auth(props: DialogProps, options: { sudo: boolean }): void {
		if (this.isTerbium) {
			this.native.Auth(props, options);
			return;
		}
		this.createAuthDialog(props, options);
	}

	/**
	 * Show a permissions dialog
	 * Terbium: uses tb.dialog.Permissions
	 * Browser: uses custom dialog
	 */
	Permissions(props: DialogProps): void {
		if (this.isTerbium) {
			this.native.Permissions(props);
			return;
		}
		const result = window.confirm(`${props.title}\n\n${props.message || ""}\n\nGrant permissions?`);
		if (result && props.onOk) {
			props.onOk(true);
		} else if (!result && props.onCancel) {
			props.onCancel();
		}
	}

	/**
	 * Show a file browser dialog
	 * Terbium: uses tb.dialog.FileBrowser
	 * Browser: uses <input type="file">
	 */
	FileBrowser(props: DialogProps): void {
		if (this.isTerbium) {
			this.native.FileBrowser(props);
			return;
		}
		const input = document.createElement("input");
		input.type = "file";
		if (props.filter) {
			input.accept = props.filter;
		}
		input.onchange = e => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file && props.onOk) {
				props.onOk(file.name);
			} else if (!file && props.onCancel) {
				props.onCancel();
			}
		};
		input.click();
	}

	/**
	 * Show a directory browser dialog
	 * Terbium: uses tb.dialog.DirectoryBrowser
	 * Browser: uses <input type="file" webkitdirectory>
	 */
	DirectoryBrowser(props: DialogProps): void {
		if (this.isTerbium) {
			this.native.DirectoryBrowser(props);
			return;
		}
		const input = document.createElement("input");
		input.type = "file";
		(input as any).webkitdirectory = true;
		input.onchange = e => {
			const files = (e.target as HTMLInputElement).files;
			if (files && files.length > 0 && props.onOk) {
				const file = files[0] as any;
				const relativePath = file.webkitRelativePath || file.name;
				const dirName = typeof relativePath === "string" ? relativePath.split("/")[0] : relativePath;
				props.onOk(dirName);
			} else if ((!files || files.length === 0) && props.onCancel) {
				props.onCancel();
			}
		};
		input.click();
	}

	/**
	 * Show a save file dialog
	 * Terbium: uses tb.dialog.SaveFile
	 * Browser: uses File System Access API or download
	 */
	SaveFile(props: DialogProps): void {
		if (this.isTerbium) {
			this.native.SaveFile(props);
			return;
		}
		if (props.onOk) {
			const filename = props.filename || "download.txt";
			props.onOk(filename);
		}
	}

	/**
	 * Show an image cropper dialog
	 * Terbium: uses tb.dialog.Cropper
	 * Browser: not supported
	 */
	Cropper(props: DialogProps): void {
		if (this.isTerbium) {
			this.native.Cropper(props);
			return;
		}
		console.warn("[TerbiumJS] Dialog.Cropper not available in browser mode");
		if (props.onCancel) {
			props.onCancel();
		}
	}

	/**
	 * Show a web authentication dialog
	 * Terbium: uses tb.dialog.WebAuth
	 * Browser: uses custom dialog
	 */
	WebAuth(props: DialogProps): void {
		if (this.isTerbium) {
			this.native.WebAuth(props);
			return;
		}
		this.createAuthDialog(props, { sudo: false });
	}

	private createSelectDialog(props: DialogProps): void {
		const overlay = document.createElement("div");
		overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;
		const dialog = document.createElement("div");
		dialog.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 8px;
      min-width: 300px;
      max-width: 500px;
    `;
		const title = document.createElement("h3");
		title.textContent = props.title;
		title.style.marginTop = "0";
		dialog.appendChild(title);
		if (props.message) {
			const message = document.createElement("p");
			message.textContent = props.message;
			dialog.appendChild(message);
		}
		const select = document.createElement("select");
		select.style.cssText = "width: 100%; padding: 8px; margin: 10px 0;";
		props.options?.forEach(option => {
			const opt = document.createElement("option");
			opt.value = option.value;
			opt.textContent = option.text;
			select.appendChild(opt);
		});
		dialog.appendChild(select);
		const buttonContainer = document.createElement("div");
		buttonContainer.style.cssText = "display: flex; gap: 10px; justify-content: flex-end; margin-top: 15px;";
		const okButton = document.createElement("button");
		okButton.textContent = "OK";
		okButton.style.cssText = "padding: 8px 16px; cursor: pointer;";
		okButton.onclick = () => {
			if (props.onOk) {
				props.onOk(select.value);
			}
			document.body.removeChild(overlay);
		};
		const cancelButton = document.createElement("button");
		cancelButton.textContent = "Cancel";
		cancelButton.style.cssText = "padding: 8px 16px; cursor: pointer;";
		cancelButton.onclick = () => {
			if (props.onCancel) {
				props.onCancel();
			}
			document.body.removeChild(overlay);
		};
		buttonContainer.appendChild(cancelButton);
		buttonContainer.appendChild(okButton);
		dialog.appendChild(buttonContainer);
		overlay.appendChild(dialog);
		document.body.appendChild(overlay);
	}

	private createAuthDialog(props: DialogProps, _options: { sudo: boolean }): void {
		const overlay = document.createElement("div");
		overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;
		const dialog = document.createElement("div");
		dialog.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 8px;
      min-width: 300px;
      max-width: 500px;
    `;
		const title = document.createElement("h3");
		title.textContent = props.title;
		title.style.marginTop = "0";
		dialog.appendChild(title);
		if (props.message) {
			const message = document.createElement("p");
			message.textContent = props.message;
			dialog.appendChild(message);
		}
		const usernameInput = document.createElement("input");
		usernameInput.type = "text";
		usernameInput.placeholder = "Username";
		usernameInput.value = props.defaultUsername || "";
		usernameInput.style.cssText = "width: 100%; padding: 8px; margin: 5px 0; box-sizing: border-box;";
		dialog.appendChild(usernameInput);
		const passwordInput = document.createElement("input");
		passwordInput.type = "password";
		passwordInput.placeholder = "Password";
		passwordInput.style.cssText = "width: 100%; padding: 8px; margin: 5px 0; box-sizing: border-box;";
		dialog.appendChild(passwordInput);
		const buttonContainer = document.createElement("div");
		buttonContainer.style.cssText = "display: flex; gap: 10px; justify-content: flex-end; margin-top: 15px;";
		const okButton = document.createElement("button");
		okButton.textContent = "OK";
		okButton.style.cssText = "padding: 8px 16px; cursor: pointer;";
		okButton.onclick = () => {
			if (props.onOk) {
				(props.onOk as any)(usernameInput.value, passwordInput.value);
			}
			document.body.removeChild(overlay);
		};
		const cancelButton = document.createElement("button");
		cancelButton.textContent = "Cancel";
		cancelButton.style.cssText = "padding: 8px 16px; cursor: pointer;";
		cancelButton.onclick = () => {
			if (props.onCancel) {
				props.onCancel();
			}
			document.body.removeChild(overlay);
		};
		buttonContainer.appendChild(cancelButton);
		buttonContainer.appendChild(okButton);
		dialog.appendChild(buttonContainer);
		overlay.appendChild(dialog);
		document.body.appendChild(overlay);
	}
}
