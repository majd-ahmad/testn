export class GenericMapper {
  static mapPrismaEntityToDomain<T, U>(
    prismaEntity: T,
    domainClass: { new (...args: any[]): U },
  ): U {
    const domainInstance = new domainClass();
    Object.assign(domainInstance, prismaEntity);
    return domainInstance;
  }

  static mapDomainEntityToPrisma<T, U>(
    domainEntity: U,
    prismaClass: { new (...args: any[]): T },
  ): T {
    const prismaInstance = new prismaClass();
    Object.assign(prismaInstance, domainEntity);
    return prismaInstance;
  }
}
