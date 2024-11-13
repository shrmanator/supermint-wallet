/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "nft-cdn.alchemy.com",
      "res.cloudinary.com", // For thumbnailUrl and pngUrl
    ], // Add any other domains you're loading images from
  },
};

export default nextConfig;
