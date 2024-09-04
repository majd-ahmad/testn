# Guide to Developing a NestJS Project with Prisma

Follow these steps to effectively develop a NestJS project using Prisma:

1. **Interface Creation**
   Begin by defining an interface for the new model. ``` product.model.ts ```
    ```typescript
        export interface IProduct {
        id: string;
        name: string;
        price: number;
        }
    ```

2. **Static Domain Creation for the Model Class** 
   Generate a static domain for the model class. ``` product.domain.ts ```
    ```typescript 
        import { IProduct } from './src/app/modelName/model/modelName.model'

        export class ProductDomain implements IProduct {
        id: string;
        name: string;
        price: number;
        }
    ```
3. **Model Class Creation**
   Construct a model class that implements the previously defined interface. ``` product.model.ts ```
4. **Constructor Creation for the Model Class**
   Establish a constructor within the model class. ``` product.model.ts ```
    ```typescript
    import { ProductDomain } from './src/app/modelName/domain/domainName.domain'

    export class ProductModel implements IProduct {
        id: string;
        name: string;
        price: number;

        constructor(data: IProduct) {
            Object.assign(this, data);
        }

        static fromDomain(domain: ProductDomain): ProductModel {
            return new ProductModel(domain);
        }
    }
    ```
5. **Update schema.prisma**
   Incorporate the SQL model and the relationships between models into your `schema.prisma`.

   ```SQL
   datasource db {
        provider = "postgresql" // or your preferred database provider
        url      = env("DATABASE_URL")
    }

    generator client {
        provider = "prisma-client-js"
    }

    model Product {
        id        String   @id @default(cuid())
        name      String
        price     Float
        category  Category @relation(fields: [categoryId], references: [id])
        categoryId String
        createdAt DateTime @default(now())
        updatedAt DateTime @updatedAt
    }

    model Category {
        id        String    @id @default(cuid())
        name      String
        products  Product[] // Relation to Product model
    }
   ```

6. **Prisma Format Verification**
   Execute the command `npx prisma format` to verify the correctness of the Prisma format.
    ```Shell
    $ npx prisma format
    Prisma schema loaded from prisma\schema.prisma
    Formatted C:\path\backend\prisma\schema.prisma in 112ms 🚀
    ```
7. **Migration Generation**
   If the Prisma format is correct, run `npx prisma migrate dev --name migration_name` to generate a migration.
   ```Shell
    $ npx prisma migrate dev --name migration_name
    ```
8. **Prisma Client Generation**
   Execute `npx prisma generate` to construct new schemas and make them accessible to the Prisma module.
    ```Shell
    $ npx prisma generate
    ```
9. **Project Restart**
   Restart your project using `nest start --watch` and add `--debug` if necessary.

10. **Repository Method Addition** ``` IProductRepository.ts ```
    Append the methods that you plan to create to the model repository. If it doesn't exist, create a new repository. This repository should be an interface containing methods that will be utilized within the service.
    ```typescript
    import { ProductDomain } from './src/app/modelName/domain/domainName.domain'

    export interface IProductRepository {
        getAllProducts(): Promise<ProductDomain[]>;
        getProductById(id: string): Promise<ProductDomain>;
    }
    ```
11. **Method Definition in  Repository Class**
    Define the method within the service and the repository class that implements the repository interface. ``` ProductRepository.ts ```
    ```typescript
    import { ProductDomain } from './src/app/modelName/domain/domainName.domain'

    async getProductById(productId: string): Promise<ProductDomain> {
        const productEntity = await this.db.product.findUnique({
        where: { id: productId },
            include: {
                productImages: true,
            },
        });
        return GenericMapper.mapPrismaEntityToDomain(productEntity, ProductDomain);
    }
    ```
12. **Method Definition in Service**
    Define the method within the service in which we inject dependencies. ``` product.service.ts ```
    ```typescript
    import {ProductDomain} from './src/app/modelName/model/modelName.model'

    @Injectable()
    export class ProductService {
        constructor(
            @Inject(IProductRepositoryToken)
            readonly productRepository: IProductRepository,
        ) {}

        async getAllProducts(): Promise<ProductModel[]> {
            const productEntities = await this.productRepository.getAllProducts();
            return productEntities.map(ProductModel.fromDomain);
        }

        async getProductById(id: string): Promise<ProductModel> {
            const productEntity = await this.productRepository.getProductById(id);
            return ProductModel.fromDomain(productEntity);
        }
    }
    ```
13. **Controller Method Creation**
    Create controller methods. ``` product.controller.ts ```
    ```typescript
    import {ProductDomain} from './src/app/modelName/model/modelName.model'

    @Controller('products')
    export class ProductController {
        constructor(private readonly productService: ProductService) {}

        @Get()
        @ApiOkResponse({ type: ProductModel, isArray: true })
        async getAllProducts(): Promise<ProductModel[]> {
            return this.productService.getAllProducts();
        }

        @Get(':id')
        @ApiOkResponse({ type: ProductModel })
        async getProductById(@Param('id') id: string): Promise<ProductModel> {
            return this.productService.getProductById(id);
        }
    }
    ```
14. **Swagger Testing**
    Lastly, test your work using Swagger ``` localhost:4000/docs ```