import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "../../components/ui/Button";

const plans = [
    {
        name: "Silver",
        price: "$29",
        period: "/month",
        features: ["Access to gym floor", "Locker room access", "Free WiFi"],
    },
    {
        name: "Gold",
        price: "$59",
        period: "/month",
        features: ["All Silver features", "Group classes", "1 Personal training session"],
        popular: true,
    },
    {
        name: "Platinum",
        price: "$99",
        period: "/month",
        features: ["All Gold features", "Unlimited Personal training", "Sauna access", "Guest pass"],
    },
];

export function PurchasePlan() {
    const [loading, setLoading] = useState(false);
    const [invoiceData, setInvoiceData] = useState<{ paymentId: string; status: string } | null>(null);
    const [selectedPlanName, setSelectedPlanName] = useState<string | null>(null);
    const [paymentMessage, setPaymentMessage] = useState<string | null>(null);

    

    const handleSelectPlan = async (planName: string) => {
    setLoading(true);
    setSelectedPlanName(planName);
    setPaymentMessage(null);
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert("Authentication error: Please log in again.");
            setSelectedPlanName(null);
            setLoading(false);
            return;
        }

        const response = await fetch(`/api/subscriptions/apply?plan=${planName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Error response:', response.status, errorData);
            throw new Error(`Failed to create subscription: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        setInvoiceData(data);
    } catch (error) {
        console.error(error);
        alert("Failed to select plan. Please try again.");
        setSelectedPlanName(null);
    } finally {
        setLoading(false);
    }
};

    const handlePayNow = async () => {
        if (!invoiceData) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/subscriptions/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    paymentId: invoiceData.paymentId,
                    amountPaid: 150, // Mock amount, ideally derived from plan
                    paymentMethod: "Bkash",
                    transactionRef: `tx-${Date.now()}`
                })
            });

            if (!response.ok) throw new Error('Payment failed');

            const data = await response.json();
            setPaymentMessage(data.message);
            setInvoiceData(null); // Clear pending invoice on success
            setSelectedPlanName(null);
        } catch (error) {
            console.error(error);
            alert("Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-extrabold text-primary-950">Choose your plan</h2>
                <p className="mt-4 text-lg text-primary-700">
                    Unlock your full potential with a membership that fits your lifestyle.
                </p>
                {paymentMessage && (
                    <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg">
                        {paymentMessage}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {plans.map((plan) => {
                    const isPending = invoiceData?.status === 'pending' && selectedPlanName === plan.name;

                    return (
                        <div key={plan.name} className={`relative flex flex-col p-6 bg-white rounded-2xl shadow-lg border ${plan.popular ? 'border-primary-500 ring-2 ring-primary-500 ring-opacity-50' : 'border-primary-200'} ${selectedPlanName && selectedPlanName !== plan.name ? 'opacity-50' : ''}`}>
                            {plan.popular && (
                                <div className="absolute top-0 transform -translate-y-1/2 left-1/2 -translate-x-1/2">
                                    <span className="inline-block px-4 py-1 rounded-full bg-primary-500 text-white text-xs font-bold tracking-wide uppercase">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-primary-950">{plan.name}</h3>
                                <div className="mt-4 flex items-baseline text-primary-950">
                                    <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                                    <span className="ml-1 text-xl font-semibold text-primary-500">{plan.period}</span>
                                </div>
                            </div>

                            <ul className="mt-6 flex-1 space-y-4">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start">
                                        <Check className="h-5 w-5 text-primary-500 flex-shrink-0" />
                                        <span className="ml-3 text-sm text-primary-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8">
                                {isPending ? (
                                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handlePayNow} disabled={loading}>
                                        {loading ? 'Processing...' : 'Pay Now'}
                                    </Button>
                                ) : (
                                    <Button
                                        className="w-full"
                                        variant={plan.popular ? 'default' : 'outline'}
                                        onClick={() => handleSelectPlan(plan.name)}
                                        disabled={loading || (!!selectedPlanName && selectedPlanName !== plan.name)}
                                    >
                                        {loading && selectedPlanName === plan.name ? 'Processing...' : 'Select Plan'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
