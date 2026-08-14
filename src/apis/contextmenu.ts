/**
 * Context Menu API
 * Right-click context menus with browser fallback
 */

import type { ContextMenuAPI, ContextMenuProps } from "../types";
import { getNativeTerbiumAPI } from "../env";

export class TerbiumContextMenu implements ContextMenuAPI {
	private get native() {
		const tb = getNativeTerbiumAPI();
		return tb?.contextmenu;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	private browserMenu: HTMLDivElement | null = null;

	create(props: ContextMenuProps): void {
		if (this.isTerbium) {
			this.native.create(props);
			return;
		}
		this.close();
		const menu = document.createElement("div");
		menu.style.cssText = `
      position: fixed;
      left: ${props.x}px;
      top: ${props.y}px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 10000;
      min-width: 150px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
    `;
		if (props.titlebar) {
			const titlebar = document.createElement("div");
			titlebar.style.cssText = `
        padding: 8px 12px;
        background: #f5f5f5;
        border-bottom: 1px solid #e0e0e0;
        font-weight: 600;
      `;
			titlebar.textContent = typeof props.titlebar === "string" ? props.titlebar : "";
			menu.appendChild(titlebar);
		}
		props.options.forEach(option => {
			const item = document.createElement("div");
			item.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        color: ${option.color || "#000"};
      `;
			item.textContent = option.text;
			item.addEventListener("mouseenter", () => {
				item.style.backgroundColor = "#e0e0e0";
			});
			item.addEventListener("mouseleave", () => {
				item.style.backgroundColor = "transparent";
			});
			item.addEventListener("click", () => {
				option.click();
				this.close();
			});
			menu.appendChild(item);
		});
		document.body.appendChild(menu);
		this.browserMenu = menu;
		const closeOnClick = (e: MouseEvent) => {
			if (!menu.contains(e.target as Node)) {
				this.close();
				document.removeEventListener("click", closeOnClick);
			}
		};
		setTimeout(() => {
			document.addEventListener("click", closeOnClick);
		}, 10);
		const rect = menu.getBoundingClientRect();
		if (rect.right > window.innerWidth) {
			menu.style.left = `${window.innerWidth - rect.width - 10}px`;
		}
		if (rect.bottom > window.innerHeight) {
			menu.style.top = `${window.innerHeight - rect.height - 10}px`;
		}
	}

	close(): void {
		if (this.isTerbium) {
			this.native.close();
			return;
		}
		if (this.browserMenu) {
			this.browserMenu.remove();
			this.browserMenu = null;
		}
	}
}
