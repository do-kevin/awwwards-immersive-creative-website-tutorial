(function () {
    function getDevice() {
        const uap = new UAParser();

        const result = uap.getResult();

        return {
            isDesktop: result.device.type === undefined,
            isPhone: result.device.type === 'mobile',
            isTablet: result.device.type === 'tablet',
        };
    }

    document.addEventListener('DOMContentLoaded', function () {
        const deviceType = getDevice();

        let deviceTypeClass = null;

        if (deviceType.isDesktop) {
            deviceTypeClass = 'desktop';
        } else if (deviceType.isTablet) {
            deviceTypeClass = 'tablet';
        } else if (deviceType.isPhone) {
            deviceTypeClass = 'phone';
        }

        const bodyElem = document.getElementById('app');
        if (document.getElementById('app')) {
            if (deviceTypeClass) {
                bodyElem.classList.add(deviceTypeClass);
            }
        }
    });
})();
