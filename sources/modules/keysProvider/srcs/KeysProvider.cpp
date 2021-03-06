#include <node.h>
#include "keys.hh"

using namespace v8;

void getSteamKey(const FunctionCallbackInfo<Value>& args) {
  args.GetReturnValue().Set(String::NewFromUtf8(Isolate::GetCurrent(), STEAM_KEY));
}

void getDiscordRpcKey(const FunctionCallbackInfo<Value>& args) {
  args.GetReturnValue().Set(String::NewFromUtf8(Isolate::GetCurrent(), DISCORD_RPC_KEY));
}

void getIgdbKey(const FunctionCallbackInfo<Value>& args) {
  args.GetReturnValue().Set(String::NewFromUtf8(Isolate::GetCurrent(), IGDB_KEY));
}

void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "steamKey", getSteamKey);
  NODE_SET_METHOD(exports, "discordRpcKey", getDiscordRpcKey);
  NODE_SET_METHOD(exports, "igdbKey", getIgdbKey);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, init);
