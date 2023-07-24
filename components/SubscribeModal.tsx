"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

import { Price, ProductWithPrice } from "@/types";
import { useUser } from "@/hooks/useUser";
import { postData } from "@/libs/helpers";
import { getStripe } from "@/libs/stripeClient";
import useSubscribeModal from "@/hooks/useSubscribeModal";

import Modal from "./Modal";
import Button from "./Button";

interface SubscribeModalProps {
    products: ProductWithPrice[];
}

const formatPrice = (price: Price) => {
    const priceString = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: price.currency,
        minimumFractionDigits: 0
    }).format((price?.unit_amount || 0) / 100);

    return priceString;
};

const SubscribeModal: React.FC<SubscribeModalProps> = ({
    products
}) => {
    const subscribeModal = useSubscribeModal();
    const { user, isLoading, subscription } = useUser();
    const [priceIdLoading, setPriceIdLoading] = useState<string>();

    const onChange = (open: boolean) => {
        if(!open) {
            subscribeModal.doClose();
        }
    }

    const handleCheckout = async (price: Price) => {
        setPriceIdLoading(price.id);
        if (!user) {
            setPriceIdLoading(undefined);
            return toast.error('Please log in first!');
        }

        if (subscription) {
            setPriceIdLoading(undefined);
            return toast('Already subscribed');
        }

        try {
            const { sessionId } = await postData({
                url: '/api/create-checkout-session', //based on the api we created (create-checkout-session)
                data: { price }
            });

            const stripe = await getStripe();
            stripe?.redirectToCheckout({ sessionId });
        } catch (error) {
            return toast.error((error as Error)?.message);
        } finally {
            setPriceIdLoading(undefined);
        }
    };

    let content = (
        <div className="text-center">
            No products available.
        </div>
    )

    if (products.length) {
        content = (
            <div>
                {products.map((product) => {
                    if (!product.prices?.length) {
                        return (
                            <div key={product.id}>
                                No prices available
                            </div>
                        );
                    }

                    //otherwise return...
                    return product.prices.map((price) => (
                        <Button
                            key={price.id}
                            className="mb-4"
                            onClick={() => handleCheckout(price)}
                            disabled={isLoading || price.id === priceIdLoading}
                        >
                            {`Subscribe a ${price.interval} for ${formatPrice(price)}`}
                        </Button>
                    ))
                })}
            </div>
        )
    }

    if (subscription) {
        content = (
            <div className="text-center">
                Already subscribed.
            </div>
        )
    }
    return (
        <Modal
            title="Only for premium users"
            description="Listen to music with Spotify Premium"
            isOpen={subscribeModal.isOpen}
            onChanges={onChange}
        >
            {content}
        </Modal>
    );
}
 
export default SubscribeModal;