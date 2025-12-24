#!/bin/bash

# Create the webp directory if it doesn't exist
mkdir -p webp

# Define widths for conversion
widths=(100 200 300 400 500 600 1000)

# Create an array of image file types to process
image_types=("*.jpg" "*.JPG" "*.jpeg" "*.png")

# Loop through each image type
for img_pattern in "${image_types[@]}"; do
    # Loop through each image file that matches the current pattern
    for img in $img_pattern; do
        # Check if the image file exists (to avoid wildcard issues)
        if [[ -f "$img" ]]; then
            # Get the filename without the extension
            filename="${img%.*}"

            for width in "${widths[@]}"; do
                # Define the output file name
                output_file="webp/${filename}_${width}px.webp"

                # Convert image to webp with specified width
                if cwebp -resize $width 0 "${img}" -o "${output_file}"; then
                    echo "Converted ${img} to ${output_file}"
                else
                    echo "Failed to convert ${img} to ${output_file}"
                fi
            done
        else
            echo "No images found for pattern: $img_pattern"
        fi
    done
done

echo "All images have been processed."

