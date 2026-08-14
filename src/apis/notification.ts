/**
 * Notification API
 * Provides cross-environment notification support matching Terbium API
 */

import type { NotificationAPI, NotificationProps } from "../types";
import { getNativeTerbiumAPI } from "../env";

export class TerbiumNotification implements NotificationAPI {
	private get native() {
		const tb = getNativeTerbiumAPI();
		return tb?.notification;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	/**
	 * Show a message notification
	 * Terbium: uses tb.notification.Message
	 * Browser: uses Notification API
	 */
	Message(props: NotificationProps): void | Promise<void> {
		if (this.isTerbium) {
			return this.native.Message(props);
		}
		this.showBrowserNotification(props);
	}

	/**
	 * Show a toast notification
	 * Terbium: uses tb.notification.Toast
	 * Browser: uses Notification API
	 */
	Toast(props: NotificationProps): void | Promise<void> {
		if (this.isTerbium) {
			return this.native.Toast(props);
		}
		this.showBrowserNotification(props);
	}

	/**
	 * Show an installing notification with progress
	 * Terbium: uses tb.notification.Installing
	 * Browser: uses Notification API with task handling
	 */
	Installing<T>(props: NotificationProps, task?: Promise<T> | (() => Promise<T>), doneToast?: Partial<NotificationProps> | null, failToast?: Partial<NotificationProps> | null): Promise<T | undefined> | void {
		if (this.isTerbium) {
			return this.native.Installing(props, task, doneToast, failToast);
		}
		this.showBrowserNotification(props);
		if (!task) {
			return;
		}
		const runTask = typeof task === "function" ? task() : task;
		return Promise.resolve(runTask)
			.then(result => {
				if (doneToast !== null) {
					this.showBrowserNotification({
						application: doneToast?.application || props.application,
						iconSrc: doneToast?.iconSrc || props.iconSrc,
						message: doneToast?.message || `${props.message} complete`,
						time: doneToast?.time,
					});
				}
				return result;
			})
			.catch(error => {
				if (failToast !== null) {
					this.showBrowserNotification({
						application: failToast?.application || props.application,
						iconSrc: failToast?.iconSrc || props.iconSrc,
						message: failToast?.message || `${props.message} failed`,
						time: failToast?.time,
					});
				}
				throw error;
			});
	}

	/**
	 * Helper to show browser notifications
	 */
	private async showBrowserNotification(props: NotificationProps): Promise<void> {
		if ("Notification" in window) {
			if (Notification.permission === "default") {
				await Notification.requestPermission();
			}
			if (Notification.permission === "granted") {
				const notification = new Notification(props.application, {
					body: props.message,
					icon: props.iconSrc,
				});
				if (props.time) {
					setTimeout(() => notification.close(), props.time);
				}
				if (props.onOk) {
					notification.onclick = () => {
						props.onOk?.();
						notification.close();
					};
				}
			} else {
				console.log(`[${props.application}] ${props.message}`);
			}
		} else {
			console.log(`[${props.application}] ${props.message}`);
		}
	}
}
