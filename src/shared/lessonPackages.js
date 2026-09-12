export const lessonPackages = [
    {
        id: 1,
        name: "Einzelstunde",
        hours: 1,
        price: 30,
        validityMonths: 1,
        validityLabel: "1 Monat",
    },
    {
        id: 2,
        name: "4er-Paket",
        hours: 4,
        price: 116,
        validityMonths: 2,
        validityLabel: "2 Monate",
    },
    {
        id: 3,
        name: "8er-Paket",
        hours: 8,
        price: 224,
        validityMonths: 3,
        validityLabel: "3 Monate",
        recommended: true,
    },
    {
        id: 4,
        name: "12er-Paket",
        hours: 12,
        price: 324,
        validityMonths: 4,
        validityLabel: "4 Monate",
    },
    {
        id: 5,
        name: "20er-Paket",
        hours: 20,
        price: 500,
        validityMonths: 5,
        validityLabel: "5 Monate",
    },
    {
        id: 6,
        name: "25er-Paket",
        hours: 25,
        price: 600,
        validityMonths: 6,
        validityLabel: "6 Monate",
    },
    {
        id: 7,
        name: "50er-Paket",
        hours: 50,
        price: 1100,
        validityMonths: 12,
        validityLabel: "12 Monate",
        bestValue: true,
    },
];

// Referenzpreis pro Stunde: der Preis der Einzelstunde, also ohne Paketrabatt.
export const baseHourlyRate =
    lessonPackages.find((paket) => paket.hours === 1)?.price ?? 30;

const euroFormatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});

export function formatEuro(value) {
    return euroFormatter.format(value);
}

// Vergleich gegen den Einzelstundenpreis: was das Paket ohne Rabatt kosten wuerde,
// wie viel gespart wird und wie hoch der Rabatt in Prozent ist.
export function getPackageSavings(paket) {
    const referencePrice = baseHourlyRate * paket.hours;
    const savings = referencePrice - paket.price;

    return {
        referencePrice,
        savings,
        percent: referencePrice > 0 ? Math.round((savings / referencePrice) * 100) : 0,
        pricePerHour: paket.price / paket.hours,
    };
}
