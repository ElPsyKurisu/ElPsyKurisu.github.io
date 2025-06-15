import os
import shutil
from PIL import Image, UnidentifiedImageError

# Attempt to import and register HEIF support for Pillow
try:
    import pillow_heif
    pillow_heif.register_heif_opener()
    HEIF_SUPPORTED = True
    print("INFO: HEIC/HEIF support is enabled.")
except ImportError:
    HEIF_SUPPORTED = False
    print("WARNING: pillow-heif library not found. HEIC/HEIF files will be skipped.")
    print("You can install it with: pip install pillow-heif")

def process_images(input_folder_name, output_folder_name="processed"):
    """
    Processes images from an input folder, converts/copies them to an output folder.

    Args:
        input_folder_name (str): Name of the folder containing source images.
                                 (Assumed to be in the same directory as the script)
        output_folder_name (str): Name of the folder where processed images will be saved.
                                  (Will be created in the same directory as the script)
    """
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_dir_path = os.path.join(script_dir, input_folder_name)
    output_dir_path = os.path.join(script_dir, output_folder_name)

    if not os.path.isdir(input_dir_path):
        print(f"ERROR: Input folder '{input_folder_name}' not found in the script's directory: {script_dir}")
        return

    os.makedirs(output_dir_path, exist_ok=True)
    print(f"INFO: Processing images from: {input_dir_path}")
    print(f"INFO: Output will be saved to: {output_dir_path}")

    copied_count = 0
    converted_count = 0
    skipped_count = 0
    error_count = 0

    # Common video extensions to skip explicitly
    video_extensions = ['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv', '.webm']
    # Image extensions to copy directly
    direct_copy_extensions = ['.jpg', '.jpeg', '.png']

    for root, _, files in os.walk(input_dir_path):
        for filename in files:
            filepath = os.path.join(root, filename)
            base, ext = os.path.splitext(filename)
            ext_lower = ext.lower()

            # Determine relative path for maintaining structure in output
            relative_path_from_input_root = os.path.relpath(root, input_dir_path)
            target_sub_dir = os.path.join(output_dir_path, relative_path_from_input_root)
            
            # For files directly in input_dir_path, relative_path_from_input_root is '.'
            # os.path.join will handle this correctly.
            if relative_path_from_input_root == ".":
                target_sub_dir = output_dir_path # Ensure files go into the root of processed
            
            os.makedirs(target_sub_dir, exist_ok=True)

            # Skip known video files
            if ext_lower in video_extensions:
                print(f"SKIPPING Video: {filepath}")
                skipped_count += 1
                continue

            try:
                # Try to open as an image
                with Image.open(filepath) as img:
                    original_format = img.format
                    
                    # If it's already JPEG or PNG, copy it
                    if original_format and original_format.upper() in ['JPEG', 'PNG']:
                        target_filepath = os.path.join(target_sub_dir, filename)
                        shutil.copy2(filepath, target_filepath) # copy2 preserves metadata
                        print(f"COPIED {original_format}: {filename} to {os.path.relpath(target_filepath, script_dir)}")
                        copied_count += 1
                    else:
                        # Convert other image formats to JPEG
                        # This includes HEIC (if supported), TIFF, BMP, GIF (static), WebP etc.
                        if not HEIF_SUPPORTED and ext_lower in ['.heic', '.heif']:
                            print(f"SKIPPING HEIC/HEIF (pillow-heif not installed): {filepath}")
                            skipped_count +=1
                            continue

                        output_filename_base = base + '.jpg'
                        target_filepath = os.path.join(target_sub_dir, output_filename_base)
                        
                        # Basic collision handling for converted files
                        counter = 1
                        temp_target_filepath = target_filepath
                        while os.path.exists(temp_target_filepath):
                            output_filename = f"{base}_converted_{counter}.jpg"
                            temp_target_filepath = os.path.join(target_sub_dir, output_filename)
                            counter += 1
                            if counter > 100: # Safety break
                                print(f"ERROR: Too many filename collisions for '{base}.jpg' in '{target_sub_dir}'. Skipping {filename}.")
                                error_count +=1
                                raise StopIteration # Break from this file's processing
                        target_filepath = temp_target_filepath
                        
                        # Convert to RGB to handle transparency before saving as JPEG
                        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                            img_to_save = img.convert('RGB')
                        else:
                            img_to_save = img

                        img_to_save.save(target_filepath, 'JPEG', quality=95)
                        print(f"CONVERTED {original_format or 'Image'} to JPEG: {filename} to {os.path.relpath(target_filepath, script_dir)}")
                        converted_count += 1

            except UnidentifiedImageError:
                print(f"SKIPPING (Not a recognized image or video): {filepath}")
                skipped_count += 1
            except StopIteration: # Custom signal for too many collisions
                continue
            except Exception as e:
                print(f"ERROR processing {filepath}: {e}")
                error_count += 1

    print("\n--- Processing Summary ---")
    print(f"Files copied (already JPEG/PNG): {copied_count}")
    print(f"Files converted to JPEG: {converted_count}")
    print(f"Files skipped (videos, non-images, or unsupported HEIC): {skipped_count}")
    print(f"Errors encountered: {error_count}")

if __name__ == "__main__":
    print("Simple Image Processor")
    print("This script will copy JPEG/PNG images and convert other common image formats to JPEG.")
    print("It will place processed files in a new 'processed' folder, maintaining subdirectories.")
    print("Original files will not be modified or deleted.")
    print("-" * 30)

    folder_name = input("Enter the name of the folder (in the same directory as this script) containing your images: ").strip()
    
    if folder_name:
        process_images(folder_name)
    else:
        print("No folder name entered. Exiting.")
    
    print("\nProcessing complete.")
