import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { CreditCard, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";

export function PaymentGateway() {
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { invoiceId } = useParams<{ invoiceId: string }>();
    const location = useLocation();

    // Get invoice details from navigation state
    const { plan, amount } = location.state || {};

    const generatePaymentId = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const generateTransactionRef = () => {
        return 'TXN' + Math.random().toString(36).substring(2, 11).toUpperCase();
    };

    const handleConfirmPayment = async () => {
        setProcessing(true);
        setError(null);

        try {
            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const token = localStorage.getItem('token');
            const paymentData = {
                paymentId: generatePaymentId(),
                amountPaid: amount || 0,
                paymentMethod: "Bkash",
                transactionRef: generateTransactionRef()
            };

            const response = await fetch('/api/subscriptions/pay', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Payment processing failed');
            }

            const data = await response.json();
            console.log('Payment response:', data);

            setSuccess(true);

            // Redirect to dashboard after success
            setTimeout(() => {
                navigate('/dashboard/member');
            }, 2000);

        } catch (err: any) {
            setError(err.message || 'Payment failed. Please try again.');
            setProcessing(false);
        }
    };

    const handleCancel = () => {
        navigate('/dashboard/member/purchase');
    };

    if (!invoiceId || !plan || !amount) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                        <div>
                            <h3 className="text-lg font-semibold text-red-900">Invalid Payment Request</h3>
                            <p className="mt-1 text-red-700">Missing invoice information. Please go back and try again.</p>
                            <Button
                                onClick={handleCancel}
                                variant="outline"
                                className="mt-4"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Plans
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl border border-primary-100 p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-green-100 p-4 rounded-full">
                            <CheckCircle className="h-16 w-16 text-green-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-primary-950 mb-4">Payment Successful!</h2>
                    <p className="text-lg text-primary-700 mb-6">
                        Your <span className="font-semibold">{plan}</span> subscription has been activated.
                    </p>
                    <p className="text-sm text-primary-600">
                        Redirecting to your dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-primary-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
                    <div className="flex items-center gap-3 text-white">
                        <CreditCard className="h-8 w-8" />
                        <div>
                            <h1 className="text-2xl font-bold">Payment Gateway</h1>
                            <p className="text-primary-100 text-sm">Secure Payment Processing</p>
                        </div>
                    </div>
                </div>

                {/* Payment Details */}
                <div className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    <div className="bg-primary-50 rounded-xl p-6 border border-primary-200">
                        <h3 className="text-lg font-semibold text-primary-950 mb-4">Order Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-primary-700">Subscription Plan</span>
                                <span className="font-semibold text-primary-950">{plan}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-primary-700">Invoice ID</span>
                                <span className="font-mono text-sm text-primary-600">{invoiceId}</span>
                            </div>
                            <div className="border-t border-primary-200 pt-3 mt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-primary-700">Total Amount</span>
                                    <span className="text-3xl font-bold text-primary-950">${amount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white border border-primary-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-primary-950 mb-4">Payment Method</h3>
                        <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-lg border-2 border-primary-500">
                            <div className="flex-shrink-0 w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">Bk</span>
                            </div>
                            <div>
                                <p className="font-semibold text-primary-950">Bkash</p>
                                <p className="text-sm text-primary-600">Mobile Payment Gateway</p>
                            </div>
                        </div>
                    </div>

                    {/* Dummy Gateway Notice */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                            <span className="font-semibold">Note:</span> This is a demo payment gateway.
                            Click "Confirm Payment" to simulate a successful payment.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={processing}
                            className="flex-1"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmPayment}
                            disabled={processing}
                            className="flex-1"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Confirm Payment
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
