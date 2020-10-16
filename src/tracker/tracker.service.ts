import { Injectable } from "@nestjs/common";
import { Repository } from "./repository.interface";
import { createHmac } from 'crypto'
import { SubscriptionRedis } from "./subscription.redis";
import { Dependency } from "./../registry/dependency.interface";
import { GitServerFactory } from "./../git-server/git-server.factory";
import { RegistryFactory } from "./../registry/registery.factory";
import { RedisService } from "./../redis/redis.service";

@Injectable()
export class TrackerService {
  repositories: Repository[]

  constructor (
    private readonly gitServerFactory: GitServerFactory,
    private readonly registryFactory: RegistryFactory,
    private readonly redisService: RedisService
  ) {
    this.repositories = []
    this.loadDatabase()
  }

  async analyze(url: string): Promise<Dependency[]> {
    const result : Dependency[] = []
    const server = this.gitServerFactory.resolve(url)

    const registries = this.registryFactory.resolve(await server.getRootFiles())

    for (const registry of registries) {
      const content = await server.getFileContent(registry.packageFileName)
      registry.resolveRependencies(content)
      result.push(...await registry.resolveOutdates())
    }

    return result
  }

  async loadDatabase () {
    const client = this.redisService.getClient()
    const keys = await client.keys('SUBSCRIPTION:*')
    for (const key of keys) {
      const value = this.toJSON((await client.get(key)).toString())
      if (value) {
        this.pushSubscription(value)
      }
    }
  }

  pushSubscription (data: SubscriptionRedis) {
    let repository = this.repositories.find(item => item.url === data.url)
    if (!repository) {
      repository = {
        url: data.url,
        subscriptions: []
      }
      this.repositories.push(repository)
    }

    repository.subscriptions.push({
      email: data.email,
      createdAt: new Date(data.createdAt)
    })
  }

  async createSubscription (url: string, emails: string[]) {
    let repository = this.repositories.find(item => item.url === url)
    if (!repository) {
      repository = {
        url: url,
        subscriptions: []
      }
      this.repositories.push(repository)
    }

    const client = await this.redisService.getClient()
    for (const email of emails) {
      const isAdded = repository.subscriptions.some(item => item.email === email)
      if (!isAdded) {
        console.log('added')
        repository.subscriptions.push({
          email,
          createdAt: new Date()
        })

        const hash = createHmac('sha512', `${url}:${email}`).digest('hex')
        await client.set(`SUBSCRIPTION:${hash}`, JSON.stringify({
          url,
          email,
          createdAt: (new Date()).toString()
        }))
      }
    }
  }

  toJSON (value: string): SubscriptionRedis|null {
    try {
      return JSON.parse(value)
    } catch (err) {
      return null
    }
  }
}