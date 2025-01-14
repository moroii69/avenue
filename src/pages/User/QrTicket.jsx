import React, { useEffect, useState } from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import url from '../../constants/url';

const QrTicket = () => {
    const { id } = useParams();
    const [book, setBook] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchBook = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/get-qr-ticket-details/${id}`);
            setBook(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBook();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const formattedDate = new Date(book.party_id?.start_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    const formattedTime = new Date(book.party_id?.start_date).toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    return (
        <div className="min-h-screen inset-0 bg-gradient-to-br from-gray-800/50 via-gray-900/30 to-black">
            <div className="flex justify-center items-center px-4 py-2">
                <div className="flex items-center gap-4 mt-5">
                    <h1 className="text-white text-2xl">QR ticket</h1>
                </div>
            </div>
            <div className="relative px-4 py-5">
                <div className="relative bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 p-6 max-w-sm mx-auto">
                    {book.party_id && (
                        <>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-white text-xl font-semibold mb-1">{book.party_id.event_name}</h2>
                                    <p className="text-gray-400 text-md">${book.amount / 100}</p>
                                </div>
                                <Share2 className="text-white w-5 h-5" />
                            </div>

                            {book.qrcode && (
                                <div className="flex justify-center mb-8">
                                    <img src={book.qrcode} alt="Payment QR Code" className="w-40 h-40" />
                                </div>
                            )}

                            <div className="border-t border-dashed border-white/20 my-6"></div>
                            <div className="grid grid-cols-2 gap-4 gap-x-14">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Venue</p>
                                    <p className="text-white">{book.party_id.venue_name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Date</p>
                                    <p className="text-white">{formattedDate}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Time</p>
                                    <p className="text-white">{formattedTime}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Tickets</p>
                                    <p className="text-white">{book.count} tickets</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="flex justify-center items-center">
                <div className="flex items-center">
                    <a href="/" className="text-white text-xl underline">Back</a>
                </div>
            </div>
        </div>
    );
};

export default QrTicket;
