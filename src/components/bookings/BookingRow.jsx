import React from 'react';
import { 
    FaUser, 
    FaMapMarkerAlt,
    FaRupeeSign,
    FaEye,
    FaDownload,
    FaChevronDown,
    FaChevronUp,
    FaCalendarAlt, 
    FaClock,
    FaBuilding,
    FaInfoCircle,
    FaRedo,
    FaUndo
} from 'react-icons/fa';
import { 
    formatTimestamp,
    formatDateShort,
    formatTimeShort,
    calculateDurationHours
} from '../../utils/formatters';

const statusConfig = {
    confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: '⏳' },
    completed: { bg: 'bg-primary-green/10', text: 'text-primary-green-dark', border: 'border-primary-green/20', icon: '✅' },
    cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: '❌' },
    pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: '⏰' }
};

const paymentStatusConfig = {
    paid: { bg: 'bg-primary-green/10', text: 'text-primary-green-dark', border: 'border-primary-green/20', icon: '💰' },
    refunded: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: '💸' },
    pending_refund: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: '⏰' },
    failed: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: '❌' }
};

const StatusBadge = ({ type, status }) => {
    const config = type === 'payment' ? paymentStatusConfig : statusConfig;
    const current = config[status] || config.pending;

    return (
        <span className={`px-3 py-1.5 inline-flex items-center text-xs leading-5 font-medium rounded-xl border ${current.bg} ${current.text} ${current.border}`}>
            <span className="mr-1.5">{current.icon}</span>
            {status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
        </span>
    );
};

const BookingRow = ({ booking, onRefundAction, onViewDetails, isExpanded, onToggleExpand }) => {
    const duration = calculateDurationHours(booking.start_time, booking.end_time);

    return (
        <>
            <tr className="border-b border-border-color-light hover:bg-hover-bg transition-colors duration-200 group">
                {/* Venue & Facility */}
                <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0"><div className="h-10 w-10 rounded-xl bg-primary-green/10 flex items-center justify-center"><FaMapMarkerAlt className="text-primary-green text-sm" /></div></div>
                        <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold text-dark-text group-hover:text-primary-green transition-colors truncate">{booking.facilities?.venues?.name || 'N/A'}</div>
                            <div className="text-xs text-light-text truncate">{booking.facilities?.name || 'N/A'}</div>
                        </div>
                    </div>
                </td>
                {/* User Details */}
                <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0"><div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center"><FaUser className="text-blue-600 text-xs" /></div></div>
                        <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-dark-text truncate">{booking.users?.username || 'N/A'}</div>
                            <div className="text-xs text-light-text truncate">{booking.users?.email || 'N/A'}</div>
                            {booking.users?.phone_number && (<div className="text-xs text-medium-text truncate">{booking.users.phone_number}</div>)}
                        </div>
                    </div>
                </td>
                {/* Booking Time */}
                <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-sm text-medium-text">
                        <FaCalendarAlt className="text-primary-green text-xs flex-shrink-0" />
                        <div>
                            <div className="font-medium">{formatDateShort(booking.booking_date)}</div>
                            <div className="text-xs text-light-text">
                                {formatTimeShort(booking.start_time)} - {formatTimeShort(booking.end_time)}
                            </div>
                            <div className="text-xs text-medium-text">
                                {duration} duration
                            </div>
                        </div>
                    </div>
                </td>
                {/* Amount */}
                <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                        <FaRupeeSign className="text-primary-green text-sm" />
                        <span className="text-lg font-bold text-dark-text">
                            {booking.total_amount?.toLocaleString('en-IN') || '0'}
                        </span>
                    </div>
                </td>
                {/* Status */}
                <td className="px-6 py-4"><StatusBadge type="booking" status={booking.status} /></td>
                {/* Payment Status */}
                <td className="px-6 py-4"><StatusBadge type="payment" status={booking.payment_status} /></td>
                {/* Actions */}
                <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                        <button 
                            onClick={() => onViewDetails(booking)}
                            className="p-2 text-medium-text hover:text-primary-green hover:bg-primary-green/10 rounded-lg transition-all duration-200"
                            title="View Details"
                        ><FaEye className="text-sm" /></button>
                        <button 
                            onClick={onToggleExpand}
                            className="p-2 text-medium-text hover:text-primary-green hover:bg-primary-green/10 rounded-lg transition-all duration-200"
                            title={isExpanded ? "Collapse" : "Expand"}
                        >{isExpanded ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}</button>
                        {booking.status === 'cancelled' && booking.payment_status === 'paid' && (
                            <button 
                                onClick={() => onRefundAction(booking.booking_id, 'refunded')} 
                                className="px-3 py-1.5 text-xs font-medium text-white bg-primary-green hover:bg-primary-green-dark rounded-lg transition-all duration-200 flex items-center space-x-1.5"
                            ><FaRedo /><span>Approve Refund</span></button>
                        )}
                        {booking.payment_status === 'refunded' && (
                            <button 
                                onClick={() => onRefundAction(booking.booking_id, 'paid')} 
                                className="px-3 py-1.5 text-xs font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-all duration-200 flex items-center space-x-1.5"
                            ><FaUndo /><span>Revert Refund</span></button>
                        )}
                    </div>
                </td>
            </tr>
            {/* Expanded Details Row */}
            {isExpanded && (
                <tr className="bg-light-green-bg border-b border-border-color-light">
                    <td colSpan="7" className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="bg-card-bg p-3 rounded-lg border border-border-color">
                                <span className="font-medium text-dark-text flex items-center"><FaInfoCircle className="mr-2 text-primary-green" />Booking ID:</span>
                                <p className="text-medium-text mt-1">{booking.booking_id}</p>
                            </div>
                            <div className="bg-card-bg p-3 rounded-lg border border-border-color">
                                <span className="font-medium text-dark-text flex items-center"><FaClock className="mr-2 text-primary-green" />Booking Date:</span>
                                {/* Uses booking_date as the "Created" equivalent */}
                                <p className="text-medium-text mt-1">{formatTimestamp(booking.booking_date, true)}</p>
                            </div>
                            <div className="bg-card-bg p-3 rounded-lg border border-border-color">
                                <span className="font-medium text-dark-text flex items-center"><FaBuilding className="mr-2 text-primary-green" />Venue Address:</span>
                                <p className="text-medium-text mt-1">
                                    {booking.facilities?.venues?.address || 'N/A'}
                                    {booking.facilities?.venues?.city && `, ${booking.facilities.venues.city}`}
                                </p>
                            </div>
                            <div className="bg-card-bg p-3 rounded-lg border border-border-color">
                                <span className="font-medium text-dark-text flex items-center"><FaRupeeSign className="mr-2 text-primary-green" />Payment Method:</span>
                                <p className="text-medium-text mt-1">{booking.payment_method || 'Online Payment'}</p>
                            </div>
                            {booking.notes && (
                                <div className="bg-card-bg p-3 rounded-lg border border-border-color md:col-span-2 lg:col-span-4">
                                    <span className="font-medium text-dark-text">Special Notes:</span>
                                    <p className="text-medium-text mt-1">{booking.notes}</p>
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

export default BookingRow;