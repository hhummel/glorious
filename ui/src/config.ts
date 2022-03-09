import { DateConstraints, Brand } from '../types'

/**
 * TODO: Gather the hard-coded configuration here
 */

export const brand: Brand = {
    name: "Glorious Grain",
    legalEntityName: "Glorious Grain LLC",
    legalEntityURL: "https://GloriousGrain.com",
    theme: "hackerTheme",
}

export const dateConstraints: DateConstraints = {
    enabledDates: [{"year": 2022, "month": 0, "date": 26}],
    disabledDates: [{"year": 2022, "month": 0, "date": 28}],
    disabledDays: [0, 1, 3, 4, 6],
    disablePast: true
  }

export const localZip = [
    19003,
    19004,
    19010,
    19035,
    19041,
    19066,
    19072,
    19085,
    19096,
    19087,
]

export const paymentChoices = {
    CSH: 'Cash',
    CHK: 'Check',
    VEN: 'Venmo',
    CRD: 'Card',
    CMP: 'Comped',
}

export const baseURL = process.env.REACT_APP_STAGE === 'local' ? 'http://localhost:8000' : '';

// TODO: Test key
export const stripePublishableKey = 'pk_test_DYeuYzpmoAucmljbl3yZ3Ds5';

export const parcelCost = 12;