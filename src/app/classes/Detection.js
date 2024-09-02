class Detection {
    isPhone() {
        if (!isPhoneChecked) {
            this.isPhoneChecked = true;

            this.isMobileCheck = document.documentElement.classList.contains('phone');
        }

        return this.isPhoneCheck;
    }

    isTablet() {
        if (!isTabletChecked) {
            this.isTabletChecked = true;

            this.isTabletCheck = document.documentElement.classList.contains('phone');
        }

        return this.isTabletCheck;
    }

    isDesktop() {
        if (!isDesktopChecked) {
            this.isDesktopChecked = true;

            this.isDesktopCheck = document.documentElement.classList.contains('phone');
        }

        return this.isDesktopCheck;
    }
}

const DetectionManager = new Detection();

export default DetectionManager;
