// tsconfig restricts `types` to ["node"], so the global augmentation from
// @types/multer (Express.Multer.File and Request.file) is not picked up
// automatically. This reference pulls it in explicitly.
/// <reference types="multer" />
