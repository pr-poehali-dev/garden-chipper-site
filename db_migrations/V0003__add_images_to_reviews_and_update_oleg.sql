ALTER TABLE t_p11111449_garden_chipper_site.reviews
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

UPDATE t_p11111449_garden_chipper_site.reviews
SET images = ARRAY[
  'https://cdn.poehali.dev/projects/30589419-8040-421a-8f96-70e5f7c9160c/bucket/0d848aba-9766-4296-955e-35910d91b043.jpg',
  'https://cdn.poehali.dev/projects/30589419-8040-421a-8f96-70e5f7c9160c/bucket/9200d4af-fa6b-4872-aef0-b1cbcb50afe8.jpg',
  'https://cdn.poehali.dev/projects/30589419-8040-421a-8f96-70e5f7c9160c/bucket/edb7fbdf-9595-4107-911f-50fecfe16b11.jpg',
  'https://cdn.poehali.dev/projects/30589419-8040-421a-8f96-70e5f7c9160c/bucket/ead362f6-4adb-457a-ba9a-135d0a4754e6.jpg',
  'https://cdn.poehali.dev/projects/30589419-8040-421a-8f96-70e5f7c9160c/bucket/e1926067-0f79-4da9-9797-2d3c4a885b13.jpg'
]
WHERE author = 'Олег (Авито)';