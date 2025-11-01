import { createMap, forMember, mapFrom } from '@automapper/core';
import { mapper } from './mapper'; // your initialized mapper
import { User } from '../models';
import { UserDto } from './dtos';

export function configureUserMapping() {
  createMap(
    mapper,
    User,
    UserDto,
    // Map _id → id
    forMember(
      (dest) => dest.id,
      mapFrom((src) => src._id.toString()),
    ),
    // Map other fields
    forMember(
      (dest) => dest.fullName,
      mapFrom((src) => src.fullName),
    ),
    forMember(
      (dest) => dest.username,
      mapFrom((src) => src.username),
    ),
    forMember(
      (dest) => dest.email,
      mapFrom((src) => src.email),
    ),
    forMember(
      (dest) => dest.role,
      mapFrom((src) => src.role),
    ),
    forMember(
      (dest) => dest.verified,
      mapFrom((src) => src.verified),
    ),
    forMember(
      (dest) => dest.createdAt,
      mapFrom((src) => src.createdAt),
    ),
    forMember(
      (dest) => dest.updatedAt,
      mapFrom((src) => src.updatedAt),
    ),
  );
}
