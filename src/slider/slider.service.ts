import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { PrismaService } from 'src/prisma';
import { MediaDto, MediaEntity, MediaService, resizeImage } from 'src/media';
import { Prisma, PrismaClient } from '@prisma/client';
import { SliderEntity } from './entities/slider.entity';

@Injectable()
export class SliderService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService
  ) {}

  whereCheckingNullClause: Prisma.SliderWhereInput = {
    isArchived: null
  }

  async create(createSliderDto: CreateSliderDto) {
    // Ensure all required fields are provided
    const places = [
      'place1Desktop', 'place1Mobile', 'place2Desktop', 'place2Mobile',
      'place3Desktop', 'place3Mobile', 'place4Desktop', 'place4Mobile'
    ];

    for (const place of places) {
      if (!createSliderDto[place]) {
        throw new BadRequestException(`All place IDs must be provided: Missing ${place}`);
      }
    }

    // Create media entities
    const mediaEntities = await Promise.all(places.map(async place => {
      return this.prisma.media.create({
        data: {
          url: createSliderDto[place], // Assuming `imageUrl` is the field in `media` table
          imageType: place.includes('Desktop') ? 'desktop' : 'mobile',
        },
      });
    }));

    // Construct the slider creation data
    const data: any = {
      createdAt: new Date(),
      updatedAt: new Date(),
      createdByUserId: createSliderDto.createdByUserId,
      updatedByUserId: createSliderDto.updatedByUserId,
      place1Desktop: { connect: { id: mediaEntities[0].id } },
      place1Mobile: { connect: { id: mediaEntities[1].id } },
      place2Desktop: { connect: { id: mediaEntities[2].id } },
      place2Mobile: { connect: { id: mediaEntities[3].id } },
      place3Desktop: { connect: { id: mediaEntities[4].id } },
      place3Mobile: { connect: { id: mediaEntities[5].id } },
      place4Desktop: { connect: { id: mediaEntities[6].id } },
      place4Mobile: { connect: { id: mediaEntities[7].id } },
    };

    // Create the slider with the correct relations
    return this.prisma.slider.create({
      data,
      include: {
        place1Desktop: true,
        place1Mobile: true,
        place2Desktop: true,
        place2Mobile: true,
        place3Desktop: true,
        place3Mobile: true,
        place4Desktop: true,
        place4Mobile: true,
      },
    });
  }

  async indexAll(): Promise<SliderEntity[]>{
    const sliders = await this.prisma.slider.findMany({
      where: this.whereCheckingNullClause,
      include: {
        place1Desktop: true,
        place1Mobile: true,
        place2Desktop: true,
        place2Mobile: true,
        place3Desktop: true,
        place3Mobile: true,
        place4Desktop: true,
        place4Mobile: true,
      },
    });

    return sliders.map(
      (slider) => new SliderEntity(slider)
    )
  }

  async findOne(id:number): Promise<SliderEntity>  {
    const slider = await this.prisma.slider.findUnique({
      where: {id},
      include: {
        place1Desktop: true,
        place1Mobile: true,
        place2Desktop: true,
        place2Mobile: true,
        place3Desktop: true,
        place3Mobile: true,
        place4Desktop: true,
        place4Mobile: true,
      },
    });

    if(!slider) {
      throw new NotFoundException(`Slide with ID ${id} not found`);
    }

    return new SliderEntity(slider);
  }

  update(id: number, updateSliderDto: UpdateSliderDto, files: Express.Multer.File[], userId: number): Promise<SliderEntity> {
    console.log('Update method called');
    console.log('Received ID:', id);
    console.log('Received DTO:', updateSliderDto);
    console.log('Received files:', files);
    console.log('Received user ID:', userId);
  
    return new Promise((resolve, reject) => {
      let slider;
      this.prisma.slider.findUnique({
        where: { id },
        include: {
          place1Desktop: true,
          place1Mobile: true,
          place2Desktop: true,
          place2Mobile: true,
          place3Desktop: true,
          place3Mobile: true,
          place4Desktop: true,
          place4Mobile: true,
        },
      })
        .then(fetchedSlider => {
          slider = fetchedSlider;
          console.log('Fetched slider: ', slider);
  
          if (!slider) {
            console.log(`Slider with ID ${id} not found`);
            return reject(new NotFoundException(`Slider with ID ${id} not found`));
          }
  
          const updatedMedia = {};
          const mediaFields = [
            'place1Desktop', 'place1Mobile',
            'place2Desktop', 'place2Mobile',
            'place3Desktop', 'place3Mobile',
            'place4Desktop', 'place4Mobile'
          ];
  
          const updatePromises = mediaFields.map(field => {
            const file = files.find(f => f.fieldname === field);
            if (file) {
              return resizeImage(file.path)
                .then(() => this.prisma.media.update({
                  where: { id: slider[field]?.id },
                  data: { url: `/uploads/${file.filename}` }
                }))
                .then(updatedMediaRecord => {
                  updatedMedia[field] = { connect: { id: updatedMediaRecord.id } };
                })
                .catch(error => {
                  console.error(`Error updating media for field ${field} with file ${file.fieldname}: `, error);
                });
            }
          });
  
          return Promise.all(updatePromises)
            .then(() => {
              const updateData = {
                ...updateSliderDto as Prisma.SliderUpdateInput,
                ...updatedMedia,
                updatedAt: new Date(),
                updatedByUserId: userId
              };
  
              // Remove undefined fields from updateData
              for (const key in updateData) {
                if (updateData[key] === undefined) {
                  delete updateData[key];
                }
              }
  
              return this.prisma.slider.update({
                where: { id },
                data: updateData,
                include: {
                  place1Desktop: true,
                  place1Mobile: true,
                  place2Desktop: true,
                  place2Mobile: true,
                  place3Desktop: true,
                  place3Mobile: true,
                  place4Desktop: true,
                  place4Mobile: true,
                },
              });
            })
            .then(updatedSlider => {
              console.log('Updated slider: ', updatedSlider);
              resolve(new SliderEntity(updatedSlider)); // Transform the result into SliderEntity
            })
            .catch(error => {
              console.error('Error updating slider: ', error);
              reject(error);
            });
        })
        .catch(error => {
          console.error(`Error fetching slider with ID ${id}:`, error);
          reject(error);
        });
    });
  }
  

}
