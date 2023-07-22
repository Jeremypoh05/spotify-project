"use client";

import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import {
    useSessionContext,
    useSupabaseClient
} from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

import useAuthModal from "@/hooks/useAuthModal";

import Modal from './Modal';

const AuthModal = () => {
    const supabaseClient = useSupabaseClient();
    const { session } = useSessionContext();
    const router = useRouter();
    const { doClose, isOpen } = useAuthModal();

    useEffect(() => {
        if (session) {
            router.refresh();
            doClose();
        }
    }, [session, router, doClose]);

    const onChange = (open: boolean) => {
        if (!open) {
            doClose();
        }
    }

    return (
        <Modal
            title="Welcome back"
            description="Login to your account."
            isOpen={isOpen}
            onChanges={onChange}
        >
            <Auth
                theme="dark"
                magicLink
                providers={["github"]}
                supabaseClient={supabaseClient}
                appearance={{
                    theme: ThemeSupa,
                    variables: {
                        default: {
                            colors: {
                                brand: '#404040',
                                brandAccent: '#22c55e'
                            }
                        }
                    }
                }}
            />
        </Modal>
    );
}

export default AuthModal;