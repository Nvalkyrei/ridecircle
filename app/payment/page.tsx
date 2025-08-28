import { PaymentForm } from "@/components/payment/payment-form"

export default function PaymentPage() {
  const bookingDetails = {
    carName: "Honda City 2022",
    dates: "Dec 25, 2024 - Dec 27, 2024",
    basePrice: 2400,
    serviceFee: 240,
    insurance: 180,
    taxes: 432,
    total: 3252,
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Complete Your Payment</h1>
          <p className="text-slate-600">Secure payment processing for your car rental</p>
        </div>
        <PaymentForm bookingDetails={bookingDetails} />
      </div>
    </div>
  )
}
