import { getContext, setContext } from "svelte";

export class SidebarState {
    isOpen = $state(false);
    toggle = () => {
        this.isOpen = !this.isOpen;
    }
    close = () => {
        this.isOpen = false;
    }
    open = () => {
        this.isOpen = true;
    }
}
const SIDEBAR_KEY = Symbol('SIDEBAR');

export function initSidebar() {
    const sidebarState = new SidebarState();
    setContext(SIDEBAR_KEY, sidebarState);
    return sidebarState;
}
export function useSidebar() {
    const sidebarState = getContext<SidebarState>(SIDEBAR_KEY);
    if (!sidebarState) {
        throw new Error('useSidebar() must be called within a component that has initialized the sidebar state.');
    }
    return sidebarState;
}
