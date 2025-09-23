// src/components/venue-form/VenueImageUploader.jsx
import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export const uploadVenueImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `venue-images/${fileName}`;

    const { data, error } = await supabase.storage
        .from('venue-images')
        .upload(filePath, file);

    if (error) {
        console.error('Error uploading file:', error);
        return null;
    }
    return supabase.storage.from('venue-images').getPublicUrl(filePath).data.publicUrl;
};

function VenueImageUploader({ venueId }) {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setUploading(true);
        setMessage('Uploading images...');

        const newImageUrls = [];
        for (const file of files) {
            const url = await uploadVenueImage(file);
            if (url) {
                newImageUrls.push(url);
            }
        }
        if (newImageUrls.length > 0) {
            const { data: venueData, error: fetchError } = await supabase
                .from('venues')
                .select('image_url')
                .eq('venue_id', venueId)
                .single();
            if (fetchError) {
                console.error('Error fetching existing images:', fetchError);
                setMessage('Error fetching existing images.');
                setUploading(false);
                return;
            }

            const existingImages = venueData.image_url || [];
            const updatedImageArray = [...existingImages, ...newImageUrls];
            const { error: updateError } = await supabase
                .from('venues')
                .update({ image_url: updatedImageArray })
                .eq('venue_id', venueId);
            if (updateError) {
                console.error('Error updating venue images:', updateError);
                setMessage('Error updating venue images.');
            } else {
                setMessage('Images added successfully!');
                setFiles([]);
            }
        } else {
            setMessage('No new images to upload.');
        }
        setUploading(false);
    };

    return (
        <form onSubmit={handleUpload} className="space-y-4">
            <h3 className="text-xl font-semibold">Add More Venue Images</h3>
            <input 
                type="file" 
                multiple 
                onChange={handleFileChange} 
                accept="image/*"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-green file:text-white hover:file:bg-primary-green-dark"
            />
            <button 
                type="submit" 
                disabled={uploading || files.length === 0} 
                className="w-full py-2 px-4 rounded-md font-semibold text-white bg-primary-green disabled:bg-gray-400 transition-colors"
            >
                {uploading ? 'Uploading...' : 'Add Images'}
            </button>
            {message && <p className="text-sm text-center">{message}</p>}
        </form>
    );
}

export default VenueImageUploader;