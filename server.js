const express = require('express');
const app = express();

// API endpoint to get photos - returns static file list
app.get('/api/photos', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;
        
        console.log(`API called: page=${page}, limit=${limit}, offset=${offset}`);
        
        // Static list of your photos (generated from your images folder)
        const allPhotos = [
            { id: 0, src: '/images/211-4.JPG', alt: '211-4', thumbnail: '/images/211-4.JPG' },
            { id: 1, src: '/images/724-03.JPG', alt: '724-03', thumbnail: '/images/724-03.JPG' },
            { id: 2, src: '/images/724-10.JPG', alt: '724-10', thumbnail: '/images/724-10.JPG' },
            { id: 3, src: '/images/724-56.JPG', alt: '724-56', thumbnail: '/images/724-56.JPG' },
            { id: 4, src: '/images/724-62.JPG', alt: '724-62', thumbnail: '/images/724-62.JPG' },
            { id: 5, src: '/images/724-70.JPG', alt: '724-70', thumbnail: '/images/724-70.JPG' },
            { id: 6, src: '/images/84190002.JPG', alt: '84190002', thumbnail: '/images/84190002.JPG' },
            { id: 7, src: '/images/84190003.JPG', alt: '84190003', thumbnail: '/images/84190003.JPG' },
            { id: 8, src: '/images/84190004.JPG', alt: '84190004', thumbnail: '/images/84190004.JPG' },
            { id: 9, src: '/images/84190006.JPG', alt: '84190006', thumbnail: '/images/84190006.JPG' },
            { id: 10, src: '/images/84190007.JPG', alt: '84190007', thumbnail: '/images/84190007.JPG' },
            { id: 11, src: '/images/84190010.JPG', alt: '84190010', thumbnail: '/images/84190010.JPG' },
            { id: 12, src: '/images/84190014.JPG', alt: '84190014', thumbnail: '/images/84190014.JPG' },
            { id: 13, src: '/images/84190016.JPG', alt: '84190016', thumbnail: '/images/84190016.JPG' },
            { id: 14, src: '/images/84190019.JPG', alt: '84190019', thumbnail: '/images/84190019.JPG' },
            { id: 15, src: '/images/84190020.JPG', alt: '84190020', thumbnail: '/images/84190020.JPG' },
            { id: 16, src: '/images/84190022.JPG', alt: '84190022', thumbnail: '/images/84190022.JPG' },
            { id: 17, src: '/images/84190025.JPG', alt: '84190025', thumbnail: '/images/84190025.JPG' },
            { id: 18, src: '/images/84190037.JPG', alt: '84190037', thumbnail: '/images/84190037.JPG' },
            { id: 19, src: '/images/84200001.JPG', alt: '84200001', thumbnail: '/images/84200001.JPG' },
            { id: 20, src: '/images/84200004.JPG', alt: '84200004', thumbnail: '/images/84200004.JPG' },
            { id: 21, src: '/images/84200006.JPG', alt: '84200006', thumbnail: '/images/84200006.JPG' },
            { id: 22, src: '/images/84200016.JPG', alt: '84200016', thumbnail: '/images/84200016.JPG' },
            { id: 23, src: '/images/84200018.JPG', alt: '84200018', thumbnail: '/images/84200018.JPG' },
            { id: 24, src: '/images/84200021.JPG', alt: '84200021', thumbnail: '/images/84200021.JPG' },
            { id: 25, src: '/images/84200022.JPG', alt: '84200022', thumbnail: '/images/84200022.JPG' },
            { id: 26, src: '/images/84200026.JPG', alt: '84200026', thumbnail: '/images/84200026.JPG' },
            { id: 27, src: '/images/84200030.JPG', alt: '84200030', thumbnail: '/images/84200030.JPG' },
            { id: 28, src: '/images/84200032.JPG', alt: '84200032', thumbnail: '/images/84200032.JPG' },
            { id: 29, src: '/images/84200033.JPG', alt: '84200033', thumbnail: '/images/84200033.JPG' },
            { id: 30, src: '/images/Carbonara.JPG', alt: 'Carbonara', thumbnail: '/images/Carbonara.JPG' },
            { id: 31, src: '/images/Chive Blossom Butter.HEIC', alt: 'Chive Blossom Butter', thumbnail: '/images/Chive Blossom Butter.HEIC' },
            { id: 32, src: '/images/DF1E866D-48FF-4B0E-8572-BB5AA73BF347.JPG', alt: 'DF1E866D-48FF-4B0E-8572-BB5AA73BF347', thumbnail: '/images/DF1E866D-48FF-4B0E-8572-BB5AA73BF347.JPG' },
            { id: 33, src: '/images/DSC00456.JPG', alt: 'DSC00456', thumbnail: '/images/DSC00456.JPG' },
            { id: 34, src: '/images/DSC00574.JPG', alt: 'DSC00574', thumbnail: '/images/DSC00574.JPG' },
            { id: 35, src: '/images/DSC00616.JPG', alt: 'DSC00616', thumbnail: '/images/DSC00616.JPG' },
            { id: 36, src: '/images/DSC00617.JPG', alt: 'DSC00617', thumbnail: '/images/DSC00617.JPG' },
            { id: 37, src: '/images/DSC00619.JPG', alt: 'DSC00619', thumbnail: '/images/DSC00619.JPG' },
            { id: 38, src: '/images/DSC00626.JPG', alt: 'DSC00626', thumbnail: '/images/DSC00626.JPG' },
            { id: 39, src: '/images/DSC00630.JPG', alt: 'DSC00630', thumbnail: '/images/DSC00630.JPG' },
            { id: 40, src: '/images/Feb 17-4.JPG', alt: 'Feb 17-4', thumbnail: '/images/Feb 17-4.JPG' },
            { id: 41, src: '/images/Feb 17-5.JPG', alt: 'Feb 17-5', thumbnail: '/images/Feb 17-5.JPG' },
            { id: 42, src: '/images/Feb 17-6.JPG', alt: 'Feb 17-6', thumbnail: '/images/Feb 17-6.JPG' },
            { id: 43, src: '/images/Feb 17-7.JPG', alt: 'Feb 17-7', thumbnail: '/images/Feb 17-7.JPG' },
            { id: 44, src: '/images/Feb7-3.JPG', alt: 'Feb7-3', thumbnail: '/images/Feb7-3.JPG' },
            { id: 45, src: '/images/Feb7-4.JPG', alt: 'Feb7-4', thumbnail: '/images/Feb7-4.JPG' },
            { id: 46, src: '/images/Feb7-5.JPG', alt: 'Feb7-5', thumbnail: '/images/Feb7-5.JPG' },
            { id: 47, src: '/images/Feb7.JPG', alt: 'Feb7', thumbnail: '/images/Feb7.JPG' },
            { id: 48, src: '/images/Feb9.JPG', alt: 'Feb9', thumbnail: '/images/Feb9.JPG' },
            { id: 49, src: '/images/IMG_0189.JPG', alt: 'IMG_0189', thumbnail: '/images/IMG_0189.JPG' },
            { id: 50, src: '/images/IMG_0190.JPG', alt: 'IMG_0190', thumbnail: '/images/IMG_0190.JPG' },
            { id: 51, src: '/images/IMG_0676.DNG', alt: 'IMG_0676', thumbnail: '/images/IMG_0676.DNG' },
            { id: 52, src: '/images/IMG_0787.JPG', alt: 'IMG_0787', thumbnail: '/images/IMG_0787.JPG' },
            { id: 53, src: '/images/IMG_9231.JPG', alt: 'IMG_9231', thumbnail: '/images/IMG_9231.JPG' },
            { id: 54, src: '/images/IMG_9232.JPG', alt: 'IMG_9232', thumbnail: '/images/IMG_9232.JPG' },
            { id: 55, src: '/images/IMG_9233.JPG', alt: 'IMG_9233', thumbnail: '/images/IMG_9233.JPG' },
            { id: 56, src: '/images/L1000031.JPG', alt: 'L1000031', thumbnail: '/images/L1000031.JPG' },
            { id: 57, src: '/images/L1000032.JPG', alt: 'L1000032', thumbnail: '/images/L1000032.JPG' },
            { id: 58, src: '/images/L1000036.JPG', alt: 'L1000036', thumbnail: '/images/L1000036.JPG' },
            { id: 59, src: '/images/L1000039.jpg', alt: 'L1000039', thumbnail: '/images/L1000039.jpg' },
            { id: 60, src: '/images/L1000048.jpg', alt: 'L1000048', thumbnail: '/images/L1000048.jpg' },
            { id: 61, src: '/images/L1000057.jpg', alt: 'L1000057', thumbnail: '/images/L1000057.jpg' },
            { id: 62, src: '/images/L1000058.jpg', alt: 'L1000058', thumbnail: '/images/L1000058.jpg' },
            { id: 63, src: '/images/L1000111.jpg', alt: 'L1000111', thumbnail: '/images/L1000111.jpg' },
            { id: 64, src: '/images/L1000151.jpg', alt: 'L1000151', thumbnail: '/images/L1000151.jpg' },
            { id: 65, src: '/images/L1000172.jpg', alt: 'L1000172', thumbnail: '/images/L1000172.jpg' },
            { id: 66, src: '/images/L1000186.jpg', alt: 'L1000186', thumbnail: '/images/L1000186.jpg' },
            { id: 67, src: '/images/L1000198.jpg', alt: 'L1000198', thumbnail: '/images/L1000198.jpg' },
            { id: 68, src: '/images/L1000204.jpg', alt: 'L1000204', thumbnail: '/images/L1000204.jpg' },
            { id: 69, src: '/images/L1000246.JPG', alt: 'L1000246', thumbnail: '/images/L1000246.JPG' },
            { id: 70, src: '/images/L1000251.JPG', alt: 'L1000251', thumbnail: '/images/L1000251.JPG' },
            { id: 71, src: '/images/L1000266.JPG', alt: 'L1000266', thumbnail: '/images/L1000266.JPG' },
            { id: 72, src: '/images/L1000271.JPG', alt: 'L1000271', thumbnail: '/images/L1000271.JPG' },
            { id: 73, src: '/images/L1000285.JPG', alt: 'L1000285', thumbnail: '/images/L1000285.JPG' },
            { id: 74, src: '/images/L1000287.JPG', alt: 'L1000287', thumbnail: '/images/L1000287.JPG' },
            { id: 75, src: '/images/L1000296.JPG', alt: 'L1000296', thumbnail: '/images/L1000296.JPG' },
            { id: 76, src: '/images/L1000442.JPG', alt: 'L1000442', thumbnail: '/images/L1000442.JPG' },
            { id: 77, src: '/images/L1000720.JPG', alt: 'L1000720', thumbnail: '/images/L1000720.JPG' },
            { id: 78, src: '/images/L1000743.JPG', alt: 'L1000743', thumbnail: '/images/L1000743.JPG' },
            { id: 79, src: '/images/L1000754.JPG', alt: 'L1000754', thumbnail: '/images/L1000754.JPG' },
            { id: 80, src: '/images/L1000760.JPG', alt: 'L1000760', thumbnail: '/images/L1000760.JPG' },
            { id: 81, src: '/images/L1000949.JPG', alt: 'L1000949', thumbnail: '/images/L1000949.JPG' },
            { id: 82, src: '/images/L1001043.JPG', alt: 'L1001043', thumbnail: '/images/L1001043.JPG' },
            { id: 83, src: '/images/L1001044.JPG', alt: 'L1001044', thumbnail: '/images/L1001044.JPG' },
            { id: 84, src: '/images/L1001052.JPG', alt: 'L1001052', thumbnail: '/images/L1001052.JPG' },
            { id: 85, src: '/images/L1001069.JPG', alt: 'L1001069', thumbnail: '/images/L1001069.JPG' },
            { id: 86, src: '/images/L1001077.JPG', alt: 'L1001077', thumbnail: '/images/L1001077.JPG' },
            { id: 87, src: '/images/L1001088.JPG', alt: 'L1001088', thumbnail: '/images/L1001088.JPG' },
            { id: 88, src: '/images/L1001252.DNG', alt: 'L1001252', thumbnail: '/images/L1001252.DNG' },
            { id: 89, src: '/images/L1001262.DNG', alt: 'L1001262', thumbnail: '/images/L1001262.DNG' },
            { id: 90, src: '/images/L1001287.JPG', alt: 'L1001287', thumbnail: '/images/L1001287.JPG' },
            { id: 91, src: '/images/L1001402.JPG', alt: 'L1001402', thumbnail: '/images/L1001402.JPG' },
            { id: 92, src: '/images/L1001404.JPG', alt: 'L1001404', thumbnail: '/images/L1001404.JPG' },
            { id: 93, src: '/images/L1001408.JPG', alt: 'L1001408', thumbnail: '/images/L1001408.JPG' },
            { id: 94, src: '/images/L1001419.JPG', alt: 'L1001419', thumbnail: '/images/L1001419.JPG' },
            { id: 95, src: '/images/L1001442.JPG', alt: 'L1001442', thumbnail: '/images/L1001442.JPG' },
            { id: 96, src: '/images/L1001451.JPG', alt: 'L1001451', thumbnail: '/images/L1001451.JPG' },
            { id: 97, src: '/images/L1001473.JPG', alt: 'L1001473', thumbnail: '/images/L1001473.JPG' },
            { id: 98, src: '/images/L1001477.JPG', alt: 'L1001477', thumbnail: '/images/L1001477.JPG' },
            { id: 99, src: '/images/L1001535.JPG', alt: 'L1001535', thumbnail: '/images/L1001535.JPG' },
            { id: 100, src: '/images/L1001537.JPG', alt: 'L1001537', thumbnail: '/images/L1001537.JPG' },
            { id: 101, src: '/images/L1001548.JPG', alt: 'L1001548', thumbnail: '/images/L1001548.JPG' },
            { id: 102, src: '/images/L1001549.JPG', alt: 'L1001549', thumbnail: '/images/L1001549.JPG' },
            { id: 103, src: '/images/L1001563.JPG', alt: 'L1001563', thumbnail: '/images/L1001563.JPG' },
            { id: 104, src: '/images/L1001607.JPG', alt: 'L1001607', thumbnail: '/images/L1001607.JPG' },
            { id: 105, src: '/images/L1001617.JPG', alt: 'L1001617', thumbnail: '/images/L1001617.JPG' },
            { id: 106, src: '/images/L1001665.JPG', alt: 'L1001665', thumbnail: '/images/L1001665.JPG' },
            { id: 107, src: '/images/L1001667.JPG', alt: 'L1001667', thumbnail: '/images/L1001667.JPG' },
            { id: 108, src: '/images/L1001670.JPG', alt: 'L1001670', thumbnail: '/images/L1001670.JPG' },
            { id: 109, src: '/images/L1001683.JPG', alt: 'L1001683', thumbnail: '/images/L1001683.JPG' },
            { id: 110, src: '/images/L1001712.JPG', alt: 'L1001712', thumbnail: '/images/L1001712.JPG' },
            { id: 111, src: '/images/L1001731.JPG', alt: 'L1001731', thumbnail: '/images/L1001731.JPG' },
            { id: 112, src: '/images/L1001732.JPG', alt: 'L1001732', thumbnail: '/images/L1001732.JPG' },
            { id: 113, src: '/images/L1001744.jpg', alt: 'L1001744', thumbnail: '/images/L1001744.jpg' },
            { id: 114, src: '/images/L1001747.jpg', alt: 'L1001747', thumbnail: '/images/L1001747.jpg' },
            { id: 115, src: '/images/Spring Garden Fried Rice.JPG', alt: 'Spring Garden Fried Rice', thumbnail: '/images/Spring Garden Fried Rice.JPG' },
            { id: 116, src: '/images/_DSF0117-2.JPG', alt: '_DSF0117-2', thumbnail: '/images/_DSF0117-2.JPG' },
            { id: 117, src: '/images/_DSF0123.JPG', alt: '_DSF0123', thumbnail: '/images/_DSF0123.JPG' },
            { id: 118, src: '/images/_DSF0208.JPG', alt: '_DSF0208', thumbnail: '/images/_DSF0208.JPG' },
            { id: 119, src: '/images/_DSF0246.JPG', alt: '_DSF0246', thumbnail: '/images/_DSF0246.JPG' },
            { id: 120, src: '/images/_DSF1255.JPG', alt: '_DSF1255', thumbnail: '/images/_DSF1255.JPG' },
            { id: 121, src: '/images/featherweight-02.JPG', alt: 'featherweight-02', thumbnail: '/images/featherweight-02.JPG' },
            { id: 122, src: '/images/featherweight-04.JPG', alt: 'featherweight-04', thumbnail: '/images/featherweight-04.JPG' },
            { id: 123, src: '/images/featherweight-07.JPG', alt: 'featherweight-07', thumbnail: '/images/featherweight-07.JPG' },
            { id: 124, src: '/images/kodak_400_bw_30933_91046_201634_000252590001.JPG', alt: 'kodak_400_bw_30933_91046_201634_000252590001', thumbnail: '/images/kodak_400_bw_30933_91046_201634_000252590001.JPG' },
            { id: 125, src: '/images/kodak_400_bw_30933_91046_201634_000252590002.JPG', alt: 'kodak_400_bw_30933_91046_201634_000252590002', thumbnail: '/images/kodak_400_bw_30933_91046_201634_000252590002.JPG' },
            { id: 126, src: '/images/kodak_400_bw_30933_91046_201634_000252590012.JPG', alt: 'kodak_400_bw_30933_91046_201634_000252590012', thumbnail: '/images/kodak_400_bw_30933_91046_201634_000252590012.JPG' }
        ];
        
        // Paginate results
        const paginatedPhotos = allPhotos.slice(offset, offset + limit);
        
        console.log(`Returning ${paginatedPhotos.length} photos, total: ${allPhotos.length}, hasMore: ${offset + limit < allPhotos.length}`);
        
        res.json({
            photos: paginatedPhotos,
            hasMore: offset + limit < allPhotos.length,
            total: allPhotos.length
        });
        
    } catch (error) {
        console.error('Error loading photos:', error);
        res.status(500).json({ error: 'Failed to load photos' });
    }
}); 