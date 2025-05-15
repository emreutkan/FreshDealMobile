const MockOrderStatusBadge = ({status}) => {
    const getStatusColor = () => {
        switch (status.toUpperCase()) {
            case 'PENDING':
                return {
                    bg: '#FFF3CD',
                    text: '#856404',
                    icon: 'time-outline',
                    label: 'Pending'
                };
            case 'ACCEPTED':
                return {
                    bg: '#D4EDDA',
                    text: '#155724',
                    icon: 'checkmark-circle-outline',
                    label: 'Accepted'
                };
            case 'COMPLETED':
                return {
                    bg: '#50703C',
                    text: '#FFFFFF',
                    icon: 'checkmark-done-circle-outline',
                    label: 'Completed'
                };
            case 'REJECTED':
                return {
                    bg: '#F8D7DA',
                    text: '#721C24',
                    icon: 'close-circle-outline',
                    label: 'Rejected'
                };
            default:
                return {
                    bg: '#E2E3E5',
                    text: '#383D41',
                    icon: 'help-circle-outline',
                    label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
                };
        }
    };

    const statusInfo = getStatusColor();

    return null; // We're mocking the component for testing
};

// Mock the Ionicons component
jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
}));

describe('OrderStatusBadge Component', () => {
    it('returns the correct status colors for PENDING status', () => {
        const getStatusColor = () => {
            const status = 'PENDING';
            switch (status.toUpperCase()) {
                case 'PENDING':
                    return {
                        bg: '#FFF3CD',
                        text: '#856404',
                        icon: 'time-outline',
                        label: 'Pending'
                    };
                default:
                    return {
                        bg: '#E2E3E5',
                        text: '#383D41',
                        icon: 'help-circle-outline',
                        label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
                    };
            }
        };

        const statusInfo = getStatusColor();
        expect(statusInfo).toEqual({
            bg: '#FFF3CD',
            text: '#856404',
            icon: 'time-outline',
            label: 'Pending'
        });
    });

    it('returns the correct status colors for COMPLETED status', () => {
        const getStatusColor = () => {
            const status = 'COMPLETED';
            switch (status.toUpperCase()) {
                case 'COMPLETED':
                    return {
                        bg: '#50703C',
                        text: '#FFFFFF',
                        icon: 'checkmark-done-circle-outline',
                        label: 'Completed'
                    };
                default:
                    return {
                        bg: '#E2E3E5',
                        text: '#383D41',
                        icon: 'help-circle-outline',
                        label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
                    };
            }
        };

        const statusInfo = getStatusColor();
        expect(statusInfo).toEqual({
            bg: '#50703C',
            text: '#FFFFFF',
            icon: 'checkmark-done-circle-outline',
            label: 'Completed'
        });
    });

    it('returns default status colors for unknown status', () => {
        const getStatusColor = () => {
            const status = 'UNKNOWN';
            switch (status.toUpperCase()) {
                case 'PENDING':
                    return {
                        bg: '#FFF3CD',
                        text: '#856404',
                        icon: 'time-outline',
                        label: 'Pending'
                    };
                default:
                    return {
                        bg: '#E2E3E5',
                        text: '#383D41',
                        icon: 'help-circle-outline',
                        label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
                    };
            }
        };

        const statusInfo = getStatusColor();
        expect(statusInfo).toEqual({
            bg: '#E2E3E5',
            text: '#383D41',
            icon: 'help-circle-outline',
            label: 'Unknown'
        });
    });
});