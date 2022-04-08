import type { NextPage } from 'next';
import Head from 'next/head';
import { MainLayout } from '../../components-layout/MainLayout';
import getAllСryptocurrencies from '../../api/getAllСryptocurrencies';
import { NextPageContext } from "next";
import { useEffect, useState } from 'react';
import CurrencyRow from './currency-row';

const Converter: NextPage = ({ currencies: serverCurrencies }: any) => {
    const [currencies, setCurrencies] = useState(serverCurrencies);

    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState(0);
    const [toCurrency, setToCurrency] = useState(0);
    console.log('amount', amount);
    console.log('fromCurrency', fromCurrency);


    useEffect(() => {
        async function load() {
            const res = await currencies;
            const json = await currencies.json()
            console.log("json", json);
            setCurrencies(json)
        }
        if (!serverCurrencies) {
            load()
        }
    }, [])

    // Set Amount:
    let incAmount = () => setAmount(Number(amount) + 1);
    let decAmount = () => amount > 0 ? setAmount(amount - 1) : '';
    let handleChange = (e: any): void => {
        (e.target.validity.valid) ? setAmount(e.target.value) : setAmount(amount);
    };

    // Preload
    if (!currencies) (<div>Load...</div>)

    return (
        <>
            <MainLayout title={'Converter Page'}>
                <section className='converter'>
                    <Head>

                    </Head>
                    <h1>Converter Page. Next.js React Crypto SPA</h1>
                    {/* Amount */}
                    <div className="input-group">
                        <input value={amount} onChange={handleChange} type="text" className="form-control" placeholder="1" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                        <div className="input-group-append">
                            <button onClick={() => incAmount()} className="btn btn-outline-secondary" type="button">+</button>
                            <button onClick={() => decAmount()} className="btn btn-outline-secondary" type="button">-</button>
                        </div>
                    </div>

                    {/* Currensies row */}
                    <div className='currencyRows'>
                        <h2>Choose currencies:</h2>
                        {/* First dropdown */}
                        <CurrencyRow currencyOptions={currencies.data} selectedCurrency={fromCurrency}
                            onChangeCurrency={(e: any) => setFromCurrency(e.target.value)} />
                        <hr/>
                        {/* Second dropdown */}
                        <CurrencyRow currencyOptions={currencies.data} selectedCurrency={toCurrency}
                            onChangeCurrency={(e: any) => setToCurrency(e.target.value)} />
                    </div>

                    {/* Result */}
                    <div className='converterResult'>
                        <h1>Result: {fromCurrency && toCurrency ? ((fromCurrency * amount) / toCurrency) : 0}</h1>
                    </div>
                </section>
            </MainLayout>
        </>

    )
}

export default Converter;

// getStaticProps - третий вариант.
// Используется если контент страницы зависит от внешних данных

export async function getStaticProps(ctx: NextPageContext) {
    const res = await fetch('https://api.cryptorank.io/v1/currencies?api_key=e3440fe2cc290ca0ad530b27be5f05cc00db9ecbcbb0d1babeaddede1b21')
    const currencies = await res.json()
    return { props: { currencies } }
}