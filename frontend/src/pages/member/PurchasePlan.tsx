import { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Check, CreditCard, AlertCircle, Loader2, CheckCircle, X } from "lucide-react";

interface Plan {
    name: string;
    price: number;
    features: string[];
    popular?: boolean;
}

interface Invoice {
    invoice_id: string;
    status: string;
    plan?: string;
    amount?: number;
}

interface Subscription {
    status: string;
    plan?: string;
    expiresAt?: string;
}

const PLANS: Plan[] = [
    {
        name: 'Silver',
        price: 29,
        features: ['Gym Floor Access', 'Locker Room', 'Free WiFi']
    },
    {
        name: 'Gold',
        price: 59,
        features: ['Gym Floor Access', 'Group Classes', '1 Trainer Session/mo', 'Sauna Access'],
        popular: true
    },
    {
        name: 'Platinum',
        price: 99,
        features: ['All Access 24/7', 'Unlimited Classes', '5 Trainer Sessions/mo', 'Nutrition Plan']
    }
];

const STORAGE_KEY = 'pending_invoice';

export function PurchasePlan() {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [pendingInvoice, setPendingInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [processingMessage, setProcessingMessage] = useState<string | null>(null);
    const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);

    useEffect(() => {
        fetchSubscriptionStatus();
    }, []);

    const fetchSubscriptionStatus = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');

            // First check localStorage for pending invoice
            const storedInvoice = localStorage.getItem(STORAGE_KEY);
            if (storedInvoice) {
                try {
                    const invoice = JSON.parse(storedInvoice);
                    setPendingInvoice(invoice);
                } catch (e) {
                    localStorage.removeItem(STORAGE_KEY);
                }
            }

            // Fetch current subscription status
            const subResponse = await fetch('/api/subscriptions/current', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (subResponse.ok) {
                const subData = await subResponse.json();
                setSubscription(subData);

                // If subscription is active, clear any stored invoice
                if (subData.status === 'active') {
                    localStorage.removeItem(STORAGE_KEY);
                    setPendingInvoice(null);
                }
            }

            // Fetch pending invoices from backend
            const invoiceResponse = await fetch('/api/subscriptions/invoices/pending', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (invoiceResponse.ok) {
                const invoiceData = await invoiceResponse.json();
                if (invoiceData && invoiceData.invoice_id) {
                    const invoice = {
                        invoice_id: invoiceData.invoice_id,
                        status: invoiceData.status,
                        plan: invoiceData.plan,
                        amount: invoiceData.amount
                    };
                    setPendingInvoice(invoice);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoice));
                } else {
                    setPendingInvoice(null);
                    localStorage.removeItem(STORAGE_KEY);
                }
            } else {
                setPendingInvoice(null);
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch (err: any) {
            console.error('Failed to fetch subscription status:', err);
            // Don't show error for 404s - just means no subscription yet
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPlan = async (planName: string) => {
        // Prevent selection if there's already a pending invoice
        if (pendingInvoice) {
            setError('You already have a pending invoice. Please complete the payment before selecting a new plan.');
            return;
        }

        setApplying(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/subscriptions/apply?plan=${planName.toLowerCase()}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                let errorMessage = 'Failed to apply for plan';

                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } else {
                    const errorText = await response.text();
                    errorMessage = errorText || errorMessage;
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            const plan = PLANS.find(p => p.name.toLowerCase() === planName.toLowerCase());

            const invoice: Invoice = {
                invoice_id: data.invoice_id,
                status: data.status,
                plan: planName,
                amount: plan?.price
            };

            setPendingInvoice(invoice);

            // Store invoice ID in localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(invoice));

        } catch (err: any) {
            console.error('Plan selection error:', err);
            setError(err.message || 'Failed to apply for plan. Please try again.');
        } finally {
            setApplying(false);
        }
    };

    const handlePayNow = async () => {
        if (!pendingInvoice) return;

        setApplying(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/subscriptions/pay', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    paymentId: pendingInvoice.invoice_id,
                    amountPaid: pendingInvoice.amount,
                    paymentMethod: "Bkash",
                    transactionRef: "sd"
                })
            });

            if (!response.ok) {
                let errorMessage = 'Payment failed';
                const errorText = await response.text().catch(() => '');
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    errorMessage = errorText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();

            // Show processing modal
            setProcessingMessage(data.message || "Payment is in processing");
            setIsProcessingModalOpen(true);

            // Immediately update local state for better UX
            setPendingInvoice(null);
            localStorage.removeItem(STORAGE_KEY);

            // Re-fetch status to update UI (this will clear invoice and show active plan)
            await fetchSubscriptionStatus();

        } catch (err: any) {
            console.error('Payment error:', err);
            setError(err.message || 'Failed to process payment. Please try again.');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    const hasActiveSubscription = subscription?.status === 'active';

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-primary-950">Purchase Subscription Plan</h1>
                <p className="mt-2 text-primary-700">Choose the plan that fits your fitness goals</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {/* Active Subscription */}
            {hasActiveSubscription && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-green-900">Active Subscription</h3>
                            <p className="mt-1 text-green-700">
                                You currently have an active <span className="font-semibold">{subscription.plan}</span> plan.
                            </p>
                            {subscription.expiresAt && (
                                <p className="mt-1 text-sm text-green-600">
                                    Expires on: {new Date(subscription.expiresAt).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Pending Invoice */}
            {pendingInvoice && !hasActiveSubscription && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-yellow-900">Pending Payment</h3>
                            <p className="mt-1 text-yellow-700">
                                You have a pending invoice for the <span className="font-semibold">{pendingInvoice.plan}</span> plan
                            </p>
                            <p className="mt-2 text-2xl font-bold text-yellow-900">
                                ${pendingInvoice.amount}/month
                            </p>
                            <p className="text-sm text-yellow-600">Invoice ID: {pendingInvoice.invoice_id}</p>
                        </div>
                        <Button
                            onClick={handlePayNow}
                            className="flex items-center gap-2"
                        >
                            <CreditCard className="h-4 w-4" />
                            Pay Now
                        </Button>
                    </div>
                </div>
            )}

            {/* Available Plans */}
            {!hasActiveSubscription && (
                <div>
                    <h2 className="text-2xl font-bold text-primary-950 mb-6">
                        {pendingInvoice ? 'Other Available Plans' : 'Choose Your Plan'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {PLANS.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative p-8 border rounded-2xl transition-all hover:shadow-xl ${plan.popular
                                    ? 'border-primary-500 ring-2 ring-primary-500 ring-opacity-20 bg-primary-50/30'
                                    : 'border-primary-200 bg-white'
                                    }`}
                            >
                                {plan.popular && (
                                    <span className="absolute top-0 right-0 -mt-3 mr-3 px-3 py-1 bg-primary-500 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                                        Popular
                                    </span>
                                )}
                                <h3 className="text-2xl font-bold text-primary-950">{plan.name}</h3>
                                <p className="mt-4 mb-6">
                                    <span className="text-4xl font-extrabold text-primary-950">${plan.price}</span>
                                    <span className="text-primary-500">/month</span>
                                </p>
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center text-primary-700">
                                            <Check className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className="w-full"
                                    variant={plan.popular ? 'default' : 'outline'}
                                    onClick={() => handleSelectPlan(plan.name)}
                                    disabled={applying || (pendingInvoice?.plan === plan.name)}
                                >
                                    {applying ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Applying...
                                        </>
                                    ) : pendingInvoice?.plan === plan.name ? (
                                        'Invoice Pending'
                                    ) : (
                                        'Select Plan'
                                    )}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* Processing Modal */}
            {isProcessingModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-primary-100 animate-in zoom-in-95 font-sans relative">
                        <button
                            onClick={() => setIsProcessingModalOpen(false)}
                            className="absolute top-4 right-4 text-primary-400 hover:text-primary-600 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <CheckCircle className="h-10 w-10 text-green-500" />
                            </div>

                            <h3 className="text-2xl font-bold text-primary-950 mb-2">Request Received</h3>
                            <p className="text-primary-600 mb-8 leading-relaxed">
                                {processingMessage}
                            </p>

                            <Button
                                onClick={() => setIsProcessingModalOpen(false)}
                                className="w-full py-6 rounded-2xl text-lg font-bold shadow-lg shadow-primary-200"
                            >
                                Got it
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
