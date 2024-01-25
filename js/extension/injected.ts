// console.log('Injected script loaded');
window.onload = () => {
    if (self.__next_f !== undefined) {
        document.dispatchEvent(new CustomEvent('NEXT_JS_PARAMS', {
            detail: JSON.stringify(self.__next_f)
        }));
    }
};