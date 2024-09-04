import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './../auth/guards/auth.guard';
import { BuyerModel } from './application/model/buyer/buyer.model';
import { BuyerService } from './application/buyer.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { IBuyerRepository } from './infrastructure/repository/buyer/IBuyerRepository';

@ApiTags('Buyers')
@Controller('buyers')
export class BuyerController implements IBuyerRepository {
    constructor(readonly buyerService: BuyerService) { }

    @UseGuards(AuthGuard)
    @ApiBearerAuth('JWT')
    @Get()
    @ApiOkResponse({ type: BuyerModel, isArray: true })
    async findAll(): Promise<BuyerModel[]> {
        try {
            return this.buyerService.findAll();
        } catch (error) {
            throw new BadRequestException();
        }
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth('JWT')
    @Put()
    @ApiOkResponse({ type: BuyerModel })
    @HttpCode(HttpStatus.OK)
    async update(
        @CurrentUser() currentUser,
        @Body() doc: BuyerModel,
    ): Promise<BuyerModel> {
        try {
            return this.buyerService.update(
                currentUser.id,
                doc,
            );
        } catch (error) {
            throw new BadRequestException();
        }
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth('JWT')
    @Post()
    @ApiCreatedResponse({ type: BuyerModel })
    async create(
        @Body() payload: BuyerModel,
    ): Promise<BuyerModel> {
        try {
            return this.buyerService.create(payload);
        } catch (error) {
            throw new BadRequestException('Cannot create buyer', {
                cause: error,
            });
        }
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth('JWT')
    @Get('byAccountId')
    @ApiOkResponse({ type: BuyerModel })
    async findByAccountId(
        @CurrentUser() currentUser,
    ): Promise<BuyerModel> {
        try {
            return await this.buyerService.findByAccountId(currentUser.id);
        } catch (error) {
            throw new NotFoundException('No buyer profile found with the provided information');
        }
    }
    @UseGuards(AuthGuard)
    @ApiBearerAuth('JWT')
    @Get(':id')
    @ApiParam({ name: 'id', type: 'string' })
    @ApiOkResponse({ type: BuyerModel })
    async findById(
        @Param("id") buyerId: string,
    ): Promise<BuyerModel> {
        try {
            return this.buyerService.findById(buyerId);
        } catch (error) {
            throw new NotFoundException('No buyer found with the provided information');
        }
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth('JWT')
    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string' })
    @ApiNoContentResponse()
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(
        @Param("id") buyerId: string,
    ): Promise<void> {
        try {
            await this.buyerService.delete(buyerId);
        } catch (error) {
            throw new NotFoundException('No buyer found with the provided information');
        }
    }

}