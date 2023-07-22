"use client";

import uniqid from "uniqid";
import React, { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import useUploadModal from '@/hooks/useUploadModal';
import { useUser } from "@/hooks/useUser";

import Modal from './Modal';
import Input from './Input';
import Button from './Button';

const UploadModal = () => {
    const [isLoading, setIsLoading] = useState(false); //set default value to false

    const uploadModal = useUploadModal();
    //By using the useSupabaseClient hook, you can easily retrieve the Supabase client instance within your components and use it to 
    //perform various operations, such as querying data, inserting records, updating data, or handling file uploads
    const supabaseClient = useSupabaseClient();
    const { user } = useUser();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            image: null,
        }
    });

    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            uploadModal.doClose();
        }
    }

    //submit the form to supabase 
    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true); //after clicking submit button, set isLoading to true

            //extracted
            const imageFile = values.image?.[0]; //first element
            const songFile = values.song?.[0]; //second element

            //ensures that both the imageFile and songFile fields are not empty and that the user is not authenticated or logged in. 
            if (!imageFile || !songFile || !user) { //since 
                toast.error('Missing fields')
                return;
            }
            //define uniq id to safely store and name things in Supabase bucket
            const uniqueID = uniqid();

            // Upload song
            const { //the data and error here is not a custom name, must follow
                data: songData,
                error: songError
            } = await supabaseClient
                .storage
                .from('songs') //from songs bucket (supabase)
                .upload(`song-${values.title}-${uniqueID}`, songFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (songError) {
                setIsLoading(false);
                return toast.error('Failed song upload');
            }

            // Upload image
            const { //the data and error here is not a custom name, must follow
                data: imageData,
                error: imageError
            } = await supabaseClient
                .storage
                .from('images') //from images bucket (supabase)
                .upload(`image-${values.title}-${uniqueID}`, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (imageError) {
                setIsLoading(false);
                return toast.error('Failed image upload');
            }

            // Create record 
            const { error: supabaseError } = await supabaseClient //remap error(default build in name to custome one)
                .from('songs') //from songs table
                .insert({
                    //pass in the information we want, make sure the user_id, title, author all must same as database column name
                    user_id: user.id,
                    title: values.title,
                    author: values.author,
                    image_path: imageData.path,
                    song_path: songData.path
                });

            if (supabaseError) {
                return toast.error(supabaseError.message);
            }

            router.refresh();
            setIsLoading(false);
            toast.success('Song created succesfully!');
            reset(); //reset the form
            uploadModal.doClose(); //close the upload form

        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false); //fter finished submitted, set is Loading to false
        }
    }

    return (
        <Modal
            title="Add a song"
            description="Upload an mp3 file"
            isOpen={uploadModal.isOpen}
            onChanges={onChange}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-y-4"
            >
                <Input
                    //make sure the id name same as the register('title') here
                    id="title"
                    disabled={isLoading}
                    //...register pass a bunch of useful props to us (onBlur, onChange, onFocus ...)
                    {...register('title', { required: true })}
                    placeholder="Song title"
                />
                <Input
                    //make sure the id name same as the register('author') here
                    id="author"
                    disabled={isLoading}
                    //...register pass a bunch of useful props to us (onBlur, onChange, onFocus ...)
                    {...register('author', { required: true })}
                    placeholder="Song author"
                />
                <div>
                    <div className="pb-1">
                        Select a song file
                    </div>
                    <Input
                        placeholder="test"
                        disabled={isLoading}
                        type="file"
                        accept=".mp3"
                        id="song"
                        {...register('song', { required: true })}
                    />
                </div>
                <div>
                    <div className="pb-1">
                        Select an image
                    </div>
                    <Input
                        placeholder="test"
                        disabled={isLoading}
                        type="file"
                        accept="image/*"
                        id="image"
                        {...register('image', { required: true })}
                    />
                </div>
                <Button disabled={isLoading} type="submit">
                    Create
                </Button>
            </form>
        </Modal>
    );
}

export default UploadModal;